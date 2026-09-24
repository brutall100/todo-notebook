import { readJson, writeJson } from './storage.js'

// Demo mode: tasks live in this browser only. No accounts, no passwords.
const TASKS_KEY = 'todo-notebook:demo-tasks'

export const DEMO_USER = { id: 'demo', name: 'Alex Doe', email: 'alex@example.com' }

const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString()

const SAMPLE_TASKS = [
  { title: 'Water the basil', note: 'The one on the kitchen window.', category: 'home', done: false, createdAt: daysAgo(0) },
  { title: 'Finish the React router chapter', note: 'Try nested routes after.', category: 'study', done: false, createdAt: daysAgo(1) },
  { title: 'Send the weekly update', note: '', category: 'work', done: true, createdAt: daysAgo(1) },
  { title: 'Pick up a parcel', note: 'Post office closes at 18:00.', category: 'errands', done: false, createdAt: daysAgo(2) },
  { title: 'Plan Saturday hike', note: 'Check the weather first.', category: 'home', done: true, createdAt: daysAgo(3) },
]

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

function load() {
  const saved = readJson(TASKS_KEY, null)
  if (Array.isArray(saved)) return saved
  const seeded = SAMPLE_TASKS.map((task) => ({ ...task, id: makeId() }))
  writeJson(TASKS_KEY, seeded)
  return seeded
}

function save(tasks) {
  writeJson(TASKS_KEY, tasks)
  return tasks
}

export const demoApi = {
  mode: 'demo',

  async listTasks() {
    return load()
  },

  async createTask(fields) {
    const task = { note: '', done: false, ...fields, id: makeId(), createdAt: new Date().toISOString() }
    save([task, ...load()])
    return task
  },

  async updateTask(id, fields) {
    let updated = null
    save(
      load().map((task) => {
        if (task.id !== id) return task
        updated = { ...task, ...fields }
        return updated
      }),
    )
    if (!updated) throw new Error('Task not found.')
    return updated
  },

  async deleteTask(id) {
    save(load().filter((task) => task.id !== id))
  },
}
