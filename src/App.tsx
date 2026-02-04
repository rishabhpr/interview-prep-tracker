import { useState } from 'react'
import { tabs, type ChecklistData, type DailyData } from '@/config/tabs'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { TopicTracker } from '@/components/topic-tracker'
import { DailyLog } from '@/components/daily-log'
import { cn } from '@/lib/utils'
import { Target } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [data, setData] = useLocalStorage<Record<string, ChecklistData | DailyData>>('interview-prep-data', {})

  const tab = tabs.find(t => t.id === activeTab)

  const getTabData = <T,>(tabId: string): T => (data[tabId] || {}) as T
  const setTabData = (tabId: string, tabData: ChecklistData | DailyData) =>
    setData(prev => ({ ...prev, [tabId]: tabData }))

  // Calculate stats for tab badges
  const getTabStats = (tabId: string) => {
    const tabConf = tabs.find(t => t.id === tabId)
    if (tabConf?.type !== 'checklist') return null
    const tabData = (data[tabId] || {}) as ChecklistData
    let total = 0, done = 0
    Object.values(tabData).forEach(items => {
      if (Array.isArray(items)) {
        total += items.length
        done += items.filter(i => i.status === 'done').length
      }
    })
    return total > 0 ? `${done}/${total}` : null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Target className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Interview Prep</h1>
          <span className="text-sm text-muted-foreground hidden sm:inline">Senior Backend Engineer</span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b sticky top-[57px] z-40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto py-1 -mb-px">
            {tabs.map(t => {
              const active = activeTab === t.id
              const stats = getTabStats(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap border-b-2 transition-all',
                    active
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {stats && (
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full',
                      active ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                    )}>
                      {stats}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab?.type === 'checklist' && (
          <TopicTracker
            key={tab.id}
            tab={tab}
            data={getTabData<ChecklistData>(tab.id)}
            onChange={(d) => setTabData(tab.id, d)}
          />
        )}
        {tab?.type === 'daily' && (
          <DailyLog
            tabs={tabs.filter(t => t.type !== 'daily')}
            data={getTabData<DailyData>('daily')}
            onChange={(d) => setTabData('daily', d)}
            allData={data}
          />
        )}
      </main>
    </div>
  )
}
