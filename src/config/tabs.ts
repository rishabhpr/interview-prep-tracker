/**
 * Tab Configuration — Add new tabs here!
 *
 * To add a new tab:
 *   1. Add an entry to the `tabs` array below
 *   2. That's it — the app renders it automatically
 */

export interface Category {
  id: string
  name: string
}

export interface TabConfig {
  id: string
  label: string
  icon: string
  type: 'checklist' | 'daily'
  showDifficulty?: boolean
  categories?: Category[]
}

export interface TrackedItem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | null
  url: string | null
  status: 'todo' | 'progress' | 'done'
  notes: string
  createdAt: string
  completedAt: string | null
}

export interface DailyEntry {
  id: string
  tabId: string
  tabLabel: string
  minutes: number
  notes: string
  time: string
}

export interface DailyData {
  entries: Record<string, DailyEntry[]>
}

export type ChecklistData = Record<string, TrackedItem[]>

export const tabs: TabConfig[] = [
  {
    id: 'dsa',
    label: 'DSA',
    icon: '⚡',
    type: 'checklist',
    showDifficulty: true,
    categories: [
      { id: 'arrays', name: 'Arrays & Strings' },
      { id: 'linked-lists', name: 'Linked Lists' },
      { id: 'trees', name: 'Trees & BST' },
      { id: 'graphs', name: 'Graphs' },
      { id: 'dp', name: 'Dynamic Programming' },
      { id: 'sorting', name: 'Sorting & Searching' },
      { id: 'stacks-queues', name: 'Stacks & Queues' },
      { id: 'heaps', name: 'Heaps & Priority Queues' },
      { id: 'hash', name: 'Hash Tables' },
      { id: 'backtracking', name: 'Recursion & Backtracking' },
    ],
  },
  {
    id: 'system-design',
    label: 'System Design',
    icon: '🏗️',
    type: 'checklist',
    showDifficulty: false,
    categories: [
      { id: 'fundamentals', name: 'Fundamentals (CAP, Load Balancing, Caching)' },
      { id: 'storage', name: 'Storage (SQL vs NoSQL, Sharding, Replication)' },
      { id: 'messaging', name: 'Messaging (Queues, Pub/Sub, Streaming)' },
      { id: 'designs', name: 'Practice Designs (Twitter, Uber, YouTube...)' },
      { id: 'distributed', name: 'Distributed Systems (Consensus, Fault Tolerance)' },
    ],
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    icon: '☸️',
    type: 'checklist',
    showDifficulty: false,
    categories: [
      { id: 'core', name: 'Core (Pods, Services, Deployments)' },
      { id: 'networking', name: 'Networking (Ingress, DNS, Policies)' },
      { id: 'storage', name: 'Storage (PV, PVC, StorageClasses)' },
      { id: 'security', name: 'Security (RBAC, Secrets, Policies)' },
      { id: 'observability', name: 'Observability (Logging, Monitoring)' },
      { id: 'advanced', name: 'Advanced (Operators, CRDs, Helm)' },
    ],
  },
  {
    id: '90-day-roadmap',
    label: '90-Day Roadmap',
    icon: '🎯',
    type: 'checklist',
    showDifficulty: false,
    categories: [
      { id: 'phase1-dsa', name: 'Phase 1 (Days 1-30): DSA Foundation — 1.5h/day DSA + 1h/day System Design Review' },
      { id: 'phase1-design', name: 'Phase 1: System Design Refresh (Leverage your App Gateway exp)' },
      { id: 'phase2-dsa', name: 'Phase 2 (Days 31-60): DSA Mastery + Mock Interviews — 1.5h DSA + 1h Mock' },
      { id: 'phase2-behavioral', name: 'Phase 2: Behavioral Prep (Googleyness, LP, Apple Culture)' },
      { id: 'phase3-mocks', name: 'Phase 3 (Days 61-75): Intensive Mocks + Weak Areas — 2h mocks + 30min review' },
      { id: 'phase3-company', name: 'Phase 3: Company-Specific Prep' },
      { id: 'phase4-final', name: 'Phase 4 (Days 76-90): Final Polish + Application — 1.5h/day' },
      { id: 'daily-checkpoints', name: 'Daily Habit Checkpoints' },
    ],
  },
  {
    id: 'daily',
    label: 'Daily Log',
    icon: '📊',
    type: 'daily',
  },
]
