export default function TabNav({ tabs, activeTab, onTabChange, data }) {
  const getTabStats = (tab) => {
    if (tab.type !== 'checklist') return null
    const tabData = data[tab.id] || {}
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
    <div className="border-b border-slate-800 bg-slate-900/50 sticky top-[73px] z-40">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto py-1 -mb-px scrollbar-hide">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            const stats = getTabStats(tab)
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg whitespace-nowrap border-b-2 transition-all ${
                  active
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {stats && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {stats}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
