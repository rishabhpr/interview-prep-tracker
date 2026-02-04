import { useState } from 'react'
import type { TabConfig, DailyData, DailyEntry, ChecklistData } from '@/config/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Clock, Flame, CheckCircle2, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const today = () => new Date().toISOString().split('T')[0]
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(): string[] {
  const dates: string[] = []
  const now = new Date()
  const day = now.getDay()
  for (let i = day; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  for (let i = 1; i < 7 - day; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

function getStreak(entries: Record<string, DailyEntry[]>): number {
  const dates = new Set(Object.keys(entries).filter(d => entries[d]?.length > 0))
  let streak = 0
  const d = new Date()
  if (dates.has(d.toISOString().split('T')[0])) {
    streak = 1
    d.setDate(d.getDate() - 1)
  } else {
    d.setDate(d.getDate() - 1)
    if (!dates.has(d.toISOString().split('T')[0])) return 0
  }
  while (dates.has(d.toISOString().split('T')[0])) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function DailyLog({
  tabs,
  data,
  onChange,
  allData,
}: {
  tabs: TabConfig[]
  data: DailyData
  onChange: (data: DailyData) => void
  allData: Record<string, ChecklistData | DailyData>
}) {
  const entries = data.entries || {}
  const [topic, setTopic] = useState(tabs[0]?.id || '')
  const [minutes, setMinutes] = useState('30')
  const [notes, setNotes] = useState('')

  const todayEntries = entries[today()] || []
  const todayMinutes = todayEntries.reduce((s, e) => s + e.minutes, 0)
  const streak = getStreak(entries)
  const weekDates = getWeekDates()

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || Number(minutes) <= 0) return
    const tabLabel = tabs.find(t => t.id === topic)?.label || topic
    const entry: DailyEntry = {
      id: crypto.randomUUID(),
      tabId: topic,
      tabLabel,
      minutes: Number(minutes),
      notes: notes.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const dayEntries = [...(entries[today()] || []), entry]
    onChange({ ...data, entries: { ...entries, [today()]: dayEntries } })
    setNotes('')
    setMinutes('30')
  }

  const deleteEntry = (date: string, id: string) => {
    const dayEntries = (entries[date] || []).filter(e => e.id !== id)
    const newEntries = { ...entries }
    if (dayEntries.length === 0) delete newEntries[date]
    else newEntries[date] = dayEntries
    onChange({ ...data, entries: newEntries })
  }

  const weekMinutes = weekDates.map(d => (entries[d] || []).reduce((s, e) => s + e.minutes, 0))
  const maxWeekMin = Math.max(...weekMinutes, 60)

  // Topic summary
  const topicSummary: Record<string, number> = {}
  todayEntries.forEach(e => {
    topicSummary[e.tabLabel] = (topicSummary[e.tabLabel] || 0) + e.minutes
  })

  // Total done across all tabs
  let totalDone = 0
  tabs.forEach(tab => {
    const tabData = (allData[tab.id] || {}) as ChecklistData
    Object.values(tabData).forEach(items => {
      if (Array.isArray(items)) totalDone += items.filter(i => i.status === 'done').length
    })
  })

  const formatTime = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m}m`
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Today', value: formatTime(todayMinutes), color: 'text-primary' },
          { icon: Flame, label: 'Day Streak', value: `${streak}${streak > 0 ? ' 🔥' : ''}`, color: 'text-amber-400' },
          { icon: CheckCircle2, label: 'Items Done', value: String(totalDone), color: 'text-emerald-400' },
          { icon: CalendarDays, label: 'Days Logged', value: String(Object.keys(entries).length), color: 'text-muted-foreground' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="text-center">
            <CardContent className="p-4">
              <Icon className={cn('h-5 w-5 mx-auto mb-1', color)} />
              <div className={cn('text-2xl font-bold', color)}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add entry form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Log Study Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addEntry} className="flex flex-col sm:flex-row gap-2">
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.icon} {t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                min="1" max="480"
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
            <Input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What did you study?"
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-1" /> Log
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Weekly chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {weekDates.map((date, i) => {
              const min = weekMinutes[i]
              const pct = (min / maxWeekMin) * 100
              const isToday = date === today()
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {min > 0 ? formatTime(min) : ''}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={cn(
                        'w-full rounded-t-md transition-all',
                        isToday ? 'bg-primary' : min > 0 ? 'bg-primary/30' : 'bg-secondary'
                      )}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className={cn('text-[10px]', isToday ? 'text-primary font-medium' : 'text-muted-foreground')}>
                    {weekDays[new Date(date + 'T12:00').getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's entries */}
      {todayEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today&apos;s Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayEntries.map(entry => (
              <div key={entry.id} className="group flex items-center gap-3 px-3 py-2 bg-accent/30 rounded-lg">
                <span className="text-xs text-muted-foreground">{entry.time}</span>
                <span className="text-sm font-medium">{entry.tabLabel}</span>
                <span className="text-xs text-primary tabular-nums">{entry.minutes}m</span>
                <span className="flex-1 text-sm text-muted-foreground truncate">{entry.notes}</span>
                <button
                  onClick={() => deleteEntry(today(), entry.id)}
                  className="text-muted-foreground hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {Object.keys(topicSummary).length > 1 && (
              <div className="pt-2 border-t flex flex-wrap gap-3">
                {Object.entries(topicSummary).map(([label, min]) => (
                  <span key={label} className="text-xs text-muted-foreground">
                    {label}: <span className="text-foreground font-medium">{min}m</span>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent history */}
      {Object.keys(entries)
        .filter(d => d !== today())
        .sort()
        .reverse()
        .slice(0, 7)
        .map(date => {
          const dayEntries = entries[date]
          const totalMin = dayEntries.reduce((s, e) => s + e.minutes, 0)
          return (
            <Card key={date} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {new Date(date + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-primary tabular-nums">{formatTime(totalMin)}</span>
                </div>
                <div className="space-y-1">
                  {dayEntries.map(entry => (
                    <div key={entry.id} className="group flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground text-xs">{entry.time}</span>
                      <span>{entry.tabLabel}</span>
                      <span className="text-xs text-muted-foreground">{entry.minutes}m</span>
                      <span className="text-muted-foreground truncate flex-1">{entry.notes}</span>
                      <button
                        onClick={() => deleteEntry(date, entry.id)}
                        className="text-muted-foreground hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
