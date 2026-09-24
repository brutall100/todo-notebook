import PropTypes from 'prop-types';
import './TodoList.css';

function TodoList({ todos, onEditTodo, onMarkAsDone }) {
  if (!todos || !Array.isArray(todos)) {
    return <div>No todos available</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => {
        if (!todo || !todo.title) {
          return null;
        }

        return (
          <li key={todo.id || todo.title} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <div className="todo-actions">
              <button onClick={() => onEditTodo(todo)} className="edit-btn">Edit</button>
              <button onClick={() => onMarkAsDone(todo.id)} className="done-btn">
                {todo.done ? 'Undo' : 'Done'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  onEditTodo: PropTypes.func.isRequired,
  onMarkAsDone: PropTypes.func.isRequired,
};

export default TodoList;




