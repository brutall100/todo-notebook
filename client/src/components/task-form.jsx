import { useEffect, useId, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CATEGORIES } from '../config/categories.js'
import InkButton from './ink-button.jsx'
import { PencilIcon } from './icons.jsx'

const EMPTY = { title: '', note: '', category: 'home' }

// Add a new task, or edit the one passed in as editingTask
function TaskForm({ editingTask, onSave, onCancelEdit }) {
  const [fields, setFields] = useState(EMPTY)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const titleRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (editingTask) {
      setFields({ title: editingTask.title, note: editingTask.note ?? '', category: editingTask.category })
      titleRef.current?.focus()
    } else {
      setFields(EMPTY)
    }
    setMessage('')
  }, [editingTask])

  const update = (name) => (event) => setFields((current) => ({ ...current, [name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = fields.title.trim()
    if (!title) {
      setMessage('Give your task a title first.')
      titleRef.current?.focus()
      return
    }

    setBusy(true)
    try {
      await onSave({ ...fields, title, note: fields.note.trim() })
      setFields(EMPTY)
      setMessage('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-title`}>What needs doing?</label>
        <input
          ref={titleRef}
          id={`${id}-title`}
          className="input"
          value={fields.title}
          onChange={update('title')}
          maxLength={120}
          placeholder="e.g. Water the plants"
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor={`${id}-note`}>
          Note <span className="field__hint">(optional)</span>
        </label>
        <textarea
          id={`${id}-note`}
          className="input"
          value={fields.note}
          onChange={update('note')}
          maxLength={500}
          placeholder="Any details worth remembering"
        />
      </div>

      <fieldset className="field cat-picker">
        <legend>Category</legend>
        {CATEGORIES.map((category) => (
          <label key={category.id} className="cat-option" style={{ '--cat': `var(--cat-${category.id})` }}>
            <input
              type="radio"
              name={`${id}-category`}
              value={category.id}
              checked={fields.category === category.id}
              onChange={update('category')}
            />
            <span>{category.label}</span>
          </label>
        ))}
      </fieldset>

      <p className="form-message" role="alert">
        {message}
      </p>

      <div className="task-form__actions">
        <InkButton type="submit" disabled={busy}>
          <PencilIcon />
          {editingTask ? 'Save changes' : 'Add to the page'}
        </InkButton>
        {editingTask && (
          <InkButton variant="soft" onClick={onCancelEdit}>
            Cancel
          </InkButton>
        )}
      </div>
    </form>
  )
}

TaskForm.propTypes = {
  editingTask: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    note: PropTypes.string,
    category: PropTypes.string.isRequired,
  }),
  onSave: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
}

export default TaskForm
