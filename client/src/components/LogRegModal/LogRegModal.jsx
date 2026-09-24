import { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { API_URL_REG_LOG } from '../../config/API_URL_REG_LOG';
import './LogRegModal.css';
import UserContext from '../UserContext';

const LogRegModal = ({ onClose }) => {
  const { setIsLoggedIn, setUserName } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const toggleMode = () => setIsLogin(!isLogin);

  const updateName = useCallback((e) => setName(e.target.value), []);
  const updatePassword = useCallback((e) => setPassword(e.target.value), []);
  const updateEmail = useCallback((e) => setEmail(e.target.value), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const endpoint = `/api/auth/${isLogin ? 'login' : 'register'}`;

    const requestBody = isLogin
      ? { name, password }  // Login with name and password
      : { name, email, password }; // Register with name, email, and password

    try {
      const response = await fetch(`${API_URL_REG_LOG}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          setMessage('Login successful');
          const { token, name } = data;

          localStorage.setItem('token', token);
          localStorage.setItem('name', name);

          setIsLoggedIn(true);
          setUserName(name);

          onClose(); // Close modal
        } else {
          setMessage('Registration successful. Please log in.');
          setIsLogin(true); // Switch to login mode
        }
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch {
      setMessage('Server error. Please try again later.');
    }
  }, [isLogin, name, password, email, setIsLoggedIn, setUserName, onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" placeholder="Name" value={name} onChange={updateName} required />
              <input type="email" placeholder="Email" value={email} onChange={updateEmail} required />
            </>
          )}
          {isLogin && (
            <input type="text" placeholder="Name" value={name} onChange={updateName} required />
          )}
          <input type="password" placeholder="Password" value={password} onChange={updatePassword} required />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={toggleMode} className="toggle-link">
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

LogRegModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LogRegModal;












