/**
 * Tab Configuration — Add new tabs here!
 *
 * Each tab needs: id, label, icon, type, and type-specific config.
 *
 * Types:
 *   "checklist" — Categorized items with status tracking (DSA, System Design, etc.)
 *   "daily"     — Daily effort log with time tracking
 *
 * To add a new tab:
 *   1. Add an entry below
 *   2. That's it — the app renders it automatically
 */

export const tabs = [
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
    id: 'daily',
    label: 'Daily Log',
    icon: '📊',
    type: 'daily',
  },
]
