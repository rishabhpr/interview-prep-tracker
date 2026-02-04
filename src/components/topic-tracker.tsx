import { useState } from 'react'
import type { TabConfig, TrackedItem, ChecklistData, Category } from '@/config/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight, Plus, Circle, CircleDot, CircleCheck, ExternalLink, StickyNote, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  todo: 'Not Started',
  progress: 'In Progress',
  done: 'Done',
}

const DIFF_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
}

// --- Add Item Form ---
function AddItemForm({
  showDifficulty,
  onAdd,
  onCancel,
}: {
  showDifficulty: boolean
  onAdd: (item: TrackedItem) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [url, setUrl] = useState('')

  const submit = (e: React.FormEvent) => {
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
    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={submit} className="p-3 bg-accent/30 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Item title..."
          className="flex-1"
          autoFocus
        />
        {showDifficulty && (
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as 'easy' | 'medium' | 'hard')}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL (optional)"
          className="sm:w-48"
        />
        <div className="flex gap-2">
          <Button type="submit" size="default" className="flex-1 sm:flex-none">Add</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </form>
  )
}

// --- Item Row ---
function ItemRow({
  item,
  showDifficulty,
  onUpdate,
  onDelete,
}: {
  item: TrackedItem
  showDifficulty: boolean
  onUpdate: (item: TrackedItem) => void
  onDelete: (id: string) => void
}) {
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState(item.notes || '')

  const cycleStatus = () => {
    const order: TrackedItem['status'][] = ['todo', 'progress', 'done']
    const next = order[(order.indexOf(item.status) + 1) % 3]
    onUpdate({
      ...item,
      status: next,
      completedAt: next === 'done' ? new Date().toISOString() : null,
    })
  }

  const saveNotes = () => {
    onUpdate({ ...item, notes })
    setShowNotes(false)
  }

  const StatusIcon = item.status === 'done' ? CircleCheck : item.status === 'progress' ? CircleDot : Circle
  const statusColor = item.status === 'done' ? 'text-emerald-400' : item.status === 'progress' ? 'text-amber-400' : 'text-muted-foreground'

  return (
    <div className="group">
      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/30 rounded-lg transition-colors">
        <button onClick={cycleStatus} className="shrink-0 p-0.5" title={STATUS_LABELS[item.status]}>
          <StatusIcon className={cn('h-5 w-5', statusColor)} />
        </button>

        <span className={cn('flex-1 text-sm', item.status === 'done' && 'line-through text-muted-foreground')}>
          {item.title}
        </span>

        {showDifficulty && item.difficulty && (
          <Badge variant={DIFF_VARIANT[item.difficulty]}>{item.difficulty}</Badge>
        )}

        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary p-1 transition-colors">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <button onClick={() => setShowNotes(!showNotes)}
          className={cn(
            'p-1 transition-colors sm:opacity-0 sm:group-hover:opacity-100',
            item.notes ? 'text-primary opacity-100' : 'text-muted-foreground hover:text-foreground'
          )}>
          <StickyNote className="h-4 w-4" />
        </button>

        <button onClick={() => onDelete(item.id)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors sm:opacity-0 sm:group-hover:opacity-100">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showNotes && (
        <div className="px-3 pb-2">
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="Add notes..."
            className="min-h-[60px]"
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

// --- Category Section ---
function CategorySection({
  category,
  items,
  showDifficulty,
  onUpdate,
}: {
  category: Category
  items: TrackedItem[]
  showDifficulty: boolean
  onUpdate: (items: TrackedItem[]) => void
}) {
  const [adding, setAdding] = useState(false)

  const done = items.filter(i => i.status === 'done').length
  const total = items.length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <Collapsible defaultOpen>
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors text-left">
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-90" />
          <span className="font-medium text-sm flex-1">{category.name}</span>
          {total > 0 && (
            <>
              <Progress value={pct} className="w-20 h-1.5 hidden sm:block" />
              <span className="text-xs text-muted-foreground tabular-nums">{done}/{total}</span>
            </>
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-2 pb-3">
            {items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                showDifficulty={showDifficulty}
                onUpdate={(updated) => onUpdate(items.map(i => i.id === updated.id ? updated : i))}
                onDelete={(id) => onUpdate(items.filter(i => i.id !== id))}
              />
            ))}

            {adding ? (
              <div className="px-2 mt-2">
                <AddItemForm
                  showDifficulty={showDifficulty}
                  onAdd={(item) => { onUpdate([...items, item]); setAdding(false) }}
                  onCancel={() => setAdding(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setAdding(true)}
                className="mt-2 mx-2 w-[calc(100%-1rem)] border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-1" /> Add item
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// --- Main Topic Tracker ---
export function TopicTracker({
  tab,
  data,
  onChange,
}: {
  tab: TabConfig
  data: ChecklistData
  onChange: (data: ChecklistData) => void
}) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'progress' | 'done'>('all')

  const getItems = (catId: string) => {
    const items = data[catId] || []
    if (filter === 'all') return items
    return items.filter(i => i.status === filter)
  }

  // Stats
  let totalItems = 0, doneItems = 0, progressItems = 0
  tab.categories?.forEach(cat => {
    const items = data[cat.id] || []
    totalItems += items.length
    doneItems += items.filter(i => i.status === 'done').length
    progressItems += items.filter(i => i.status === 'progress').length
  })

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'Not Started' },
    { key: 'progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ]

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Total: <span className="text-foreground font-medium">{totalItems}</span>
          </span>
          <span className="text-emerald-400">
            Done: <span className="font-medium">{doneItems}</span>
          </span>
          <span className="text-amber-400">
            In Progress: <span className="font-medium">{progressItems}</span>
          </span>
        </div>
        <div className="flex gap-1">
          {filters.map(f => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter(f.key)}
              className="text-xs"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overall progress */}
      {totalItems > 0 && <Progress value={(doneItems / totalItems) * 100} />}

      {/* Categories */}
      <div className="space-y-3">
        {tab.categories?.map(cat => (
          <CategorySection
            key={cat.id}
            category={cat}
            items={getItems(cat.id)}
            showDifficulty={tab.showDifficulty ?? false}
            onUpdate={(items) => onChange({ ...data, [cat.id]: items })}
          />
        ))}
      </div>
    </div>
  )
}
