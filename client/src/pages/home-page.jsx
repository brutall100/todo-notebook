import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/index.js'
import { useAuth } from '../context/auth-context.jsx'
import { CATEGORIES } from '../config/categories.js'
import TaskForm from '../components/task-form.jsx'
import TaskItem from '../components/task-item.jsx'
import TaskStats from '../components/task-stats.jsx'
import InkButton from '../components/ink-button.jsx'
import AuthDialog from '../components/auth-dialog.jsx'
import Reveal from '../components/reveal.jsx'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'To do' },
  { id: 'done', label: 'Done' },
]

const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

function HomePage() {
  const { user, checking, isDemo } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [dialogMode, setDialogMode] = useState(null)

  // Load this user's tasks whenever the user changes (log in / log out)
  useEffect(() => {
    if (!user) {
      setTasks([])
      return
    }
    setLoading(true)
    setError('')
    api
      .listTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const handleSave = useCallback(
    async (fields) => {
      if (editingTask) {
        const updated = await api.updateTask(editingTask.id, fields)
        setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)))
        setEditingTask(null)
      } else {
        const created = await api.createTask(fields)
        setTasks((current) => [created, ...current])
      }
    },
    [editingTask],
  )

  const handleToggle = useCallback(async (task) => {
    // Update the screen right away, undo if the save fails
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: !task.done } : item)))
    try {
      await api.updateTask(task.id, { done: !task.done })
    } catch (err) {
      setTasks((current) => current.map((item) => (item.id === task.id ? task : item)))
      setError(err.message)
    }
  }, [])

  const handleDelete = useCallback(async (id) => {
    try {
      await api.deleteTask(id)
      setTasks((current) => current.filter((task) => task.id !== id))
      setEditingTask((current) => (current?.id === id ? null : current))
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const handleEdit = useCallback((task) => {
    setEditingTask(task)
    document.getElementById('task-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          (status === 'all' || (status === 'done') === task.done) &&
          (category === 'all' || task.category === category),
      ),
    [tasks, status, category],
  )

  const firstName = user?.name.split(' ')[0]

  return (
    <div className="container">
      <section className="hero">
        <p className="hand hero__kicker">{firstName ? `Hi ${firstName}, what's on the page today?` : "What's on the page today?"}</p>
        <h1 className="hero__title">
          Your <mark>notebook</mark>
        </h1>
        <p className="hero__lead">
          {today}. Write it down, tick it off, and watch the page fill up with little wins.
        </p>
        {isDemo && (
          <p className="mode-note">
            <span className="badge">Demo</span>
            Tasks are saved in this browser only.
          </p>
        )}
      </section>

      {!user ? (
        <Reveal className="page locked">
          {checking ? (
            <p className="hand" style={{ fontSize: '1.8rem' }}>Opening your notebook…</p>
          ) : (
            <>
              <h2>This notebook is locked</h2>
              <p>Log in or create an account to see your own tasks.</p>
              <div className="locked__actions">
                <InkButton onClick={() => setDialogMode('login')}>Log in</InkButton>
                <InkButton variant="soft" onClick={() => setDialogMode('register')}>
                  Create account
                </InkButton>
              </div>
            </>
          )}
          {dialogMode && <AuthDialog initialMode={dialogMode} onClose={() => setDialogMode(null)} />}
        </Reveal>
      ) : (
        <div className="spread">
          <aside className="sticky">
            <Reveal className="sticky-note" id="task-form">
              <h2>{editingTask ? 'Edit task' : 'New task'}</h2>
              <TaskForm editingTask={editingTask} onSave={handleSave} onCancelEdit={() => setEditingTask(null)} />
            </Reveal>
            <Reveal delay={120}>
              <TaskStats tasks={tasks} />
            </Reveal>
          </aside>

          <Reveal as="section" className="page" delay={80} aria-labelledby="page-title">
            <div className="page__head">
              <h2 id="page-title">Today&apos;s page</h2>
              <div className="filters" role="group" aria-label="Show tasks">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className="filter-tab"
                    aria-pressed={status === filter.id}
                    onClick={() => setStatus(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters" role="group" aria-label="Filter by category" style={{ marginBottom: '1.25rem' }}>
              {[{ id: 'all', label: 'Every category' }, ...CATEGORIES].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="filter-tab"
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {error && (
              <p className="form-message" role="alert" style={{ marginBottom: '1rem' }}>
                {error}
              </p>
            )}

            {loading ? (
              <p className="hand empty">Turning the pages…</p>
            ) : visibleTasks.length ? (
              <ul className="task-list" aria-live="polite">
                {visibleTasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            ) : (
              <div className="empty">
                <p className="hand">{tasks.length ? 'Nothing here with these filters.' : 'A blank page. Lovely.'}</p>
                <small>{tasks.length ? 'Try another tab.' : 'Add your first task on the sticky note ✎'}</small>
              </div>
            )}
          </Reveal>
        </div>
      )}
    </div>
  )
}

export default HomePage
