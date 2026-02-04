import { useState } from 'react'
import { tabs } from './config/tabs'
import { useLocalStorage } from './hooks/useLocalStorage'
import TabNav from './components/TabNav'
import TopicTracker from './components/TopicTracker'
import DailyLog from './components/DailyLog'

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [data, setData] = useLocalStorage('interview-prep-data', {})

  const tab = tabs.find(t => t.id === activeTab)

  const getTabData = (tabId) => data[tabId] || {}
  const setTabData = (tabId, tabData) => setData(prev => ({ ...prev, [tabId]: tabData }))

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>🎯</span>
            <span>Interview Prep</span>
            <span className="text-sm font-normal text-slate-500 hidden sm:inline">— Senior Backend Engineer</span>
          </h1>
        </div>
      </header>

      {/* Tabs */}
      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} data={data} />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab?.type === 'checklist' && (
          <TopicTracker
            key={tab.id}
            tab={tab}
            data={getTabData(tab.id)}
            onChange={(d) => setTabData(tab.id, d)}
          />
        )}
        {tab?.type === 'daily' && (
          <DailyLog
            tabs={tabs.filter(t => t.type !== 'daily')}
            data={getTabData('daily')}
            onChange={(d) => setTabData('daily', d)}
            allData={data}
          />
        )}
      </main>
    </div>
  )
}
