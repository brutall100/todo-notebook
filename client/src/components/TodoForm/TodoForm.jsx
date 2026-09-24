import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './TodoForm.css'

function TodoForm({ onAddTodo, onEditTodo, editingTodo, categories }) {
	const [todoTitle, setTodoTitle] = useState('')
	const [todoDescription, setTodoDescription] = useState('')
	const [todoCategory, setTodoCategory] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	// Populate fields with editingTodo data when in editing mode
	useEffect(() => {
		if (editingTodo) {
			setTodoTitle(editingTodo.title)
			setTodoDescription(editingTodo.description)
			setTodoCategory(editingTodo.category || '') // Default to empty if no category exists
		}
	}, [editingTodo])

	const handleAddTodo = (e) => {
		e.preventDefault()

		if (todoTitle.trim() === '' || todoDescription.trim() === '' || todoCategory.trim() === '') {
			setErrorMessage('Title, description, and category are required')
			return
		}

		setErrorMessage('')
		if (editingTodo) {
			onEditTodo(editingTodo.id, todoTitle, todoDescription, todoCategory) // Edit an existing todo
		} else {
			onAddTodo(todoTitle, todoDescription, todoCategory) // Add a new todo
		}

		setTodoTitle('')
		setTodoDescription('')
		setTodoCategory('')
	}

	return (
		<form className='todo-form' onSubmit={handleAddTodo}>
			<input
				type='text'
				className='todo-input'
				placeholder='Enter todo title'
				value={todoTitle}
				onChange={(e) => setTodoTitle(e.target.value)}
			/>
			<textarea
				className='todo-textarea'
				placeholder='Enter todo description'
				value={todoDescription}
				onChange={(e) => setTodoDescription(e.target.value)}
			/>
			<select value={todoCategory} onChange={(e) => setTodoCategory(e.target.value)} className='todo-category'>
				<option value=''>Select Category</option>
				{categories.map((category) => (
					<option key={category._id} value={category._id}>
						{category.name}
					</option>
				))}
			</select>
			<button type='submit' className='add-todo-button'>
				{editingTodo ? 'Save Changes' : 'Add Todo'}
			</button>
			{errorMessage && <div className='error-message'>{errorMessage}</div>}
		</form>
	)
}

TodoForm.propTypes = {
  onAddTodo: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
  editingTodo: PropTypes.object,
  categories: PropTypes.array.isRequired,
};

export default TodoForm
