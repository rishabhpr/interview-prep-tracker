import { useState } from 'react'

const STATUS = { todo: 'Not Started', progress: 'In Progress', done: 'Done' }
const STATUS_COLORS = {
  todo: 'bg-slate-700 text-slate-300',
  progress: 'bg-amber-500/20 text-amber-400',
  done: 'bg-emerald-500/20 text-emerald-400',
}
const DIFF_COLORS = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-rose-500/20 text-rose-400',
}

function AddItemForm({ showDifficulty, onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [url, setUrl] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      difficulty: showDifficulty ? difficulty : null,
      url: url.trim() || null,
      status: 'todo',
      notes: '',
      createdAt: new Date().toISOString(),
      completedAt: null,
    })
    setTitle(''); setUrl(''); setDifficulty('medium')
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <input
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Item title..."
        className="flex-1 min-w-[200px] px-3 py-2 bg-slate-900 rounded-md border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        autoFocus
      />
      {showDifficulty && (
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          className="px-3 py-2 bg-slate-900 rounded-md border border-slate-700 text-sm text-slate-300 focus:outline-none focus:border-indigo-500">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      )}
      <input
        value={url} onChange={e => setUrl(e.target.value)}
        placeholder="URL (optional)"
        className="flex-1 min-w-[150px] px-3 py-2 bg-slate-900 rounded-md border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm font-medium">Add</button>
      <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm">Cancel</button>
    </form>
  )
}

function ItemRow({ item, showDifficulty, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(item.notes || '')

  const cycleStatus = () => {
    const order = ['todo', 'progress', 'done']
    const next = order[(order.indexOf(item.status) + 1) % 3]
    onUpdate({
      ...item,
      status: next,
      completedAt: next === 'done' ? new Date().toISOString() : null,
    })
  }

  const saveNotes = () => {
    onUpdate({ ...item, notes })
    setEditing(false)
  }

  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/50 rounded-lg">
      {/* Status checkbox */}
      <button onClick={cycleStatus} className="shrink-0" title={STATUS[item.status]}>
        {item.status === 'done' ? (
          <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        ) : item.status === 'progress' ? (
          <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400"/>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-slate-400"/>
        )}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm ${item.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
        {item.title}
      </span>

      {/* Difficulty */}
      {showDifficulty && item.difficulty && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLORS[item.difficulty]}`}>
          {item.difficulty}
        </span>
      )}

      {/* Link */}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener" className="text-slate-500 hover:text-indigo-400 text-sm">🔗</a>
      )}

      {/* Notes toggle */}
      <button onClick={() => setEditing(!editing)}
        className={`text-sm opacity-0 group-hover:opacity-100 ${item.notes ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
        📝
      </button>

      {/* Delete */}
      <button onClick={() => onDelete(item.id)}
        className="text-sm text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100">✕</button>

      {/* Notes area */}
      {editing && (
        <div className="w-full mt-2">
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            onBlur={saveNotes} onKeyDown={e => e.key === 'Escape' && saveNotes()}
            placeholder="Notes..."
            className="w-full px-3 py-2 bg-slate-900 rounded-md border border-slate-700 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-y min-h-[60px]"
            autoFocus />
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, items, showDifficulty, onUpdate }) {
  const [collapsed, setCollapsed] = useState(false)
  const [adding, setAdding] = useState(false)

  const done = items.filter(i => i.status === 'done').length
  const total = items.length
  const pct = total > 0 ? (done / total) * 100 : 0

  const addItem = (item) => {
    onUpdate([...items, item])
    setAdding(false)
  }
  const updateItem = (updated) => onUpdate(items.map(i => i.id === updated.id ? updated : i))
  const deleteItem = (id) => onUpdate(items.filter(i => i.id !== id))

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <button onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 text-left">
        <svg className={`w-4 h-4 text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
        </svg>
        <span className="font-medium text-sm text-slate-200 flex-1">{category.name}</span>
        {total > 0 && (
          <>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }}/>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">{done}/{total}</span>
          </>
        )}
      </button>

      {!collapsed && (
        <div className="px-2 pb-3">
          {items.map(item => (
            <ItemRow key={item.id} item={item} showDifficulty={showDifficulty}
              onUpdate={updateItem} onDelete={deleteItem} />
          ))}

          {adding ? (
            <div className="px-2 mt-2">
              <AddItemForm showDifficulty={showDifficulty} onAdd={addItem} onCancel={() => setAdding(false)} />
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="mt-1 ml-3 text-sm text-slate-500 hover:text-indigo-400 flex items-center gap-1">
              <span>+</span> Add item
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function TopicTracker({ tab, data, onChange }) {
  const [filter, setFilter] = useState('all')

  const getItems = (catId) => {
    const items = data[catId] || []
    if (filter === 'all') return items
    return items.filter(i => i.status === filter)
  }

  const setItems = (catId, items) => {
    onChange({ ...data, [catId]: items })
  }

  // Stats
  let totalItems = 0, doneItems = 0, progressItems = 0
  tab.categories.forEach(cat => {
    const items = data[cat.id] || []
    totalItems += items.length
    doneItems += items.filter(i => i.status === 'done').length
    progressItems += items.filter(i => i.status === 'progress').length
  })

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 text-sm">
          <span className="text-slate-400">
            Total: <span className="text-slate-200 font-medium">{totalItems}</span>
          </span>
          <span className="text-emerald-400">
            Done: <span className="font-medium">{doneItems}</span>
          </span>
          <span className="text-amber-400">
            In Progress: <span className="font-medium">{progressItems}</span>
          </span>
        </div>
        <div className="flex gap-1 text-xs">
          {['all', 'todo', 'progress', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md font-medium ${
                filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}>
              {f === 'all' ? 'All' : STATUS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Overall progress */}
      {totalItems > 0 && (
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
            style={{ width: `${(doneItems / totalItems) * 100}%` }}/>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {tab.categories.map(cat => (
          <CategorySection key={cat.id} category={cat}
            items={getItems(cat.id)} showDifficulty={tab.showDifficulty}
            onUpdate={(items) => setItems(cat.id, items)} />
        ))}
      </div>
    </div>
  )
}
