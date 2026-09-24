import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState(''); // State for user's name

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (token && name) {
      setIsLoggedIn(true);
      setUserEmail(name); // Now using name for email
      setUserName(name);
    }
  }, []);

  const login = (name, token) => {
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setUserEmail(name); 
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('');
  };

  return (
    <UserContext.Provider 
      value={{ 
        isLoggedIn, 
        userEmail, 
        userName, 
        login, 
        logout, 
        setIsLoggedIn, 
        setUserEmail, 
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;







