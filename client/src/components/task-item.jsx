import { useState } from 'react'
import PropTypes from 'prop-types'
import { categoryLabel } from '../config/categories.js'
import { useReducedMotion } from '../hooks/use-reduced-motion.js'
import InkButton from './ink-button.jsx'
import { EraserIcon, PencilIcon } from './icons.jsx'

const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

function TaskItem({ task, index, onToggle, onEdit, onDelete }) {
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const checkboxId = `task-${task.id}`

  // Let the card fly off the page before it is removed
  const handleDelete = () => {
    if (reduced) onDelete(task.id)
    else setLeaving(true)
  }

  const classes = ['task', task.done && 'is-done', leaving && 'is-leaving'].filter(Boolean).join(' ')

  return (
    <li
      className={classes}
      style={{ '--cat': `var(--cat-${task.category})`, animationDelay: leaving ? '0ms' : `${Math.min(index, 8) * 60}ms` }}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onDelete(task.id)
      }}
    >
      <span className="check">
        <input id={checkboxId} type="checkbox" checked={task.done} onChange={() => onToggle(task)} />
        <svg viewBox="0 0 30 30" aria-hidden="true">
          <rect className="check__box" x="2" y="2" width="26" height="26" rx="6" />
          <path className="check__tick" d="M7 15.5l5.5 5.5L24 8" />
        </svg>
      </span>

      <div className="task__body">
        <label htmlFor={checkboxId} className="task__title">
          {task.title}
          <span className="task__strike" aria-hidden="true" />
        </label>
        {task.note && <p className="task__note">{task.note}</p>}
        <div className="task__meta">
          <span className="chip">{categoryLabel(task.category)}</span>
          {task.createdAt && <time dateTime={task.createdAt}>{dateFormat.format(new Date(task.createdAt))}</time>}
        </div>
      </div>

      <div className="task__actions">
        <InkButton variant="icon" className="btn--soft" onClick={() => onEdit(task)} aria-label={`Edit “${task.title}”`}>
          <PencilIcon />
        </InkButton>
        <InkButton variant="icon" className="btn--soft" onClick={handleDelete} disabled={leaving} aria-label={`Delete “${task.title}”`}>
          <EraserIcon />
        </InkButton>
      </div>
    </li>
  )
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    note: PropTypes.string,
    category: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default TaskItem
