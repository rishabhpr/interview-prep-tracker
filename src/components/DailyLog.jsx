import { useState } from 'react'

const today = () => new Date().toISOString().split('T')[0]
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates() {
  const dates = []
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

function getStreak(entries) {
  const dates = new Set(Object.keys(entries).filter(d => entries[d]?.length > 0))
  let streak = 0
  const d = new Date()
  // Check today first
  if (dates.has(d.toISOString().split('T')[0])) {
    streak = 1
    d.setDate(d.getDate() - 1)
  } else {
    // If no entry today, check yesterday
    d.setDate(d.getDate() - 1)
    if (!dates.has(d.toISOString().split('T')[0])) return 0
  }
  while (dates.has(d.toISOString().split('T')[0])) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export default function DailyLog({ tabs, data, onChange, allData }) {
  const entries = data.entries || {}
  const [topic, setTopic] = useState(tabs[0]?.id || '')
  const [minutes, setMinutes] = useState(30)
  const [notes, setNotes] = useState('')

  const todayEntries = entries[today()] || []
  const todayMinutes = todayEntries.reduce((s, e) => s + e.minutes, 0)
  const streak = getStreak(entries)
  const weekDates = getWeekDates()

  const addEntry = (e) => {
    e.preventDefault()
    if (!topic || minutes <= 0) return
    const tabLabel = tabs.find(t => t.id === topic)?.label || topic
    const entry = {
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
    setMinutes(30)
  }

  const deleteEntry = (date, id) => {
    const dayEntries = (entries[date] || []).filter(e => e.id !== id)
    const newEntries = { ...entries }
    if (dayEntries.length === 0) delete newEntries[date]
    else newEntries[date] = dayEntries
    onChange({ ...data, entries: newEntries })
  }

  // Weekly max for bar scaling
  const weekMinutes = weekDates.map(d => (entries[d] || []).reduce((s, e) => s + e.minutes, 0))
  const maxWeekMin = Math.max(...weekMinutes, 60)

  // Topic summary for today
  const topicSummary = {}
  todayEntries.forEach(e => {
    topicSummary[e.tabLabel] = (topicSummary[e.tabLabel] || 0) + e.minutes
  })

  // Total items done across all checklist tabs
  let totalDone = 0
  tabs.forEach(tab => {
    const tabData = allData[tab.id] || {}
    Object.values(tabData).forEach(items => {
      if (Array.isArray(items)) totalDone += items.filter(i => i.status === 'done').length
    })
  })

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400">{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</div>
          <div className="text-xs text-slate-500 mt-1">Today</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{streak} {streak > 0 ? '🔥' : ''}</div>
          <div className="text-xs text-slate-500 mt-1">Day Streak</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{totalDone}</div>
          <div className="text-xs text-slate-500 mt-1">Items Done</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-300">{Object.keys(entries).length}</div>
          <div className="text-xs text-slate-500 mt-1">Days Logged</div>
        </div>
      </div>

      {/* Add entry form */}
      <form onSubmit={addEntry} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Log Study Session</h3>
        <div className="flex flex-wrap gap-2">
          <select value={topic} onChange={e => setTopic(e.target.value)}
            className="px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
            {tabs.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <input type="number" value={minutes} onChange={e => setMinutes(e.target.value)} min="1" max="480"
              className="w-20 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-200 text-center focus:outline-none focus:border-indigo-500" />
            <span className="text-sm text-slate-500">min</span>
          </div>
          <input value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="What did you study?"
            className="flex-1 min-w-[200px] px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
          <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium">+ Log</button>
        </div>
      </form>

      {/* Weekly chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-4">This Week</h3>
        <div className="flex items-end gap-2 h-32">
          {weekDates.map((date, i) => {
            const min = weekMinutes[i]
            const pct = (min / maxWeekMin) * 100
            const isToday = date === today()
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {min > 0 ? `${Math.floor(min / 60)}h${min % 60 > 0 ? `${min % 60}m` : ''}` : ''}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div className={`w-full rounded-t-md transition-all ${
                    isToday ? 'bg-indigo-500' : min > 0 ? 'bg-indigo-600/50' : 'bg-slate-800'
                  }`} style={{ height: `${Math.max(pct, 4)}%` }}/>
                </div>
                <span className={`text-[10px] ${isToday ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                  {weekDays[new Date(date + 'T12:00').getDay()]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's entries */}
      {todayEntries.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Today&apos;s Sessions</h3>
          <div className="space-y-2">
            {todayEntries.map(entry => (
              <div key={entry.id} className="group flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
                <span className="text-xs text-slate-500">{entry.time}</span>
                <span className="text-sm font-medium text-slate-300">{entry.tabLabel}</span>
                <span className="text-xs text-indigo-400 tabular-nums">{entry.minutes}m</span>
                <span className="flex-1 text-sm text-slate-400 truncate">{entry.notes}</span>
                <button onClick={() => deleteEntry(today(), entry.id)}
                  className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 text-sm">✕</button>
              </div>
            ))}
          </div>
          {/* Topic breakdown */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-3">
            {Object.entries(topicSummary).map(([label, min]) => (
              <span key={label} className="text-xs text-slate-400">
                {label}: <span className="text-slate-200 font-medium">{min}m</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent history */}
      {Object.keys(entries).filter(d => d !== today()).sort().reverse().slice(0, 7).map(date => {
        const dayEntries = entries[date]
        const totalMin = dayEntries.reduce((s, e) => s + e.minutes, 0)
        return (
          <div key={date} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-400">{new Date(date + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
              <span className="text-xs text-indigo-400 tabular-nums">{Math.floor(totalMin / 60)}h {totalMin % 60}m</span>
            </div>
            <div className="space-y-1">
              {dayEntries.map(entry => (
                <div key={entry.id} className="group flex items-center gap-3 text-sm">
                  <span className="text-slate-500 text-xs">{entry.time}</span>
                  <span className="text-slate-300">{entry.tabLabel}</span>
                  <span className="text-xs text-slate-500">{entry.minutes}m</span>
                  <span className="text-slate-500 truncate flex-1">{entry.notes}</span>
                  <button onClick={() => deleteEntry(date, entry.id)}
                    className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
