import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header/Header';
import TodoList from '../../components/TodoList/TodoList';
import TodoForm from '../../components/TodoForm/TodoForm';
import { API_URL } from '../../config/Api_URL';
import UserContext from '../../components/UserContext';
import './HomePage.css';
import axios from 'axios';

function HomePage() {
  const { isLoggedIn, userName } = useContext(UserContext); // Access user info from context
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  //// Fetch Todos from the API
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/todos`);
      const normalizedTodos = response.data.map((todo) => ({
        ...todo,
        id: todo._id || todo.id, 
      }));
      setTodos(normalizedTodos);
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
  };

  //// Fetch Categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCategories(); 
  }, []);

  const handleAddTodo = async (title, description, category) => {
    const newTodo = {
      title: title,
      description: description,
      category: category,
      done: false, 
    };

    try {
      const response = await axios.post(`${API_URL}/api/todos`, newTodo);

      const createdTodo = {
        ...response.data,
        id: response.data._id || response.data.id, 
      };

      setTodos((previousTodos) => [...previousTodos, createdTodo]);
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const handleEditTodo = async (id, title, description, category) => {
    if (!id) {
      console.error('Cannot update todo: id is undefined');
      return;
    }

    const updatedTodo = { title, description, category };
    console.log('Updating todo:', id, updatedTodo);

    try {
      await axios.put(`${API_URL}/api/todos/${id}`, updatedTodo);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, title, description, category } : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleMarkAsDone = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const updatedTodo = { ...todoToUpdate, done: !todoToUpdate.done };

      await axios.patch(`${API_URL}/api/todos/${id}`, { done: updatedTodo.done });

      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, done: updatedTodo.done } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  };

  return (
    <div className="home-page">
      <Header />
      <div className="content">
        {isLoggedIn && <p className="welcome-message">Welcome back, {userName}!</p>} {/* Display user name */}
        <TodoForm
          onAddTodo={handleAddTodo}
          onEditTodo={handleEditTodo}
          editingTodo={editingTodo}
          categories={categories} 
        />
        <TodoList
          todos={todos}
          onEditTodo={(todo) => setEditingTodo(todo)}
          onMarkAsDone={handleMarkAsDone}
        />
      </div>
    </div>
  );
}

export default HomePage;








