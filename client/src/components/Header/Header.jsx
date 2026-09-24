import { useState, useContext, useEffect } from 'react';
import UserContext from '../../components/UserContext';
import LoginModal from '../LogRegModal/LogRegModal';
import './Header.css';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, userName, logout } = useContext(UserContext); // Access userName from context

  // Log the context data to the console
  useEffect(() => {
    console.log("Context Data:", { isLoggedIn, userName });
  }, [isLoggedIn, userName]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/" className="nav-link">Namai</a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link">Apie</a>
          </li>
          <li className="nav-item">
            <a href="/features" className="nav-link">DII Pasiulymai</a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">Susisiekime</a>
          </li>
        </ul>
      </nav>

      {!isLoggedIn ? (
        <button onClick={toggleModal}>Login / Register</button>
      ) : (
        <div>
          <p className="welcome-message">Welcome back, {userName || 'Guest'}!</p> {/* Show the user's name or 'Guest' */}
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      )}

      {isModalOpen && (
        <LoginModal 
          onClose={toggleModal} 
        />
      )}
    </header>
  );
}

export default Header;








