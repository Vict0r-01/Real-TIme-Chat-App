'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize state without localStorage
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Move localStorage operations to useEffect
  useEffect(() => {
    // Initialize state from localStorage
    setUsername(localStorage.getItem('username') || '');
    setProfileImage(localStorage.getItem('profileImage') || '');
    setToken(localStorage.getItem('token') || '');
    setIsLoading(false);

    // Check JWT token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      if (decodedToken?.sub && !username) {
        setUsername(decodedToken.sub);
      }
    }
  }, []);

  // Persist to localStorage when values change
  useEffect(() => {
    if (!isLoading) {
      if (username) localStorage.setItem('username', username);
      if (profileImage) localStorage.setItem('profileImage', profileImage);
      if (token) localStorage.setItem('token', token);
    }
  }, [username, profileImage, token, isLoading]);

  const login = (newToken, newUsername, newProfileImage) => {
    setToken(newToken);
    setUsername(newUsername);
    setProfileImage(newProfileImage);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profileImage');
    setToken('');
    setUsername('');
    setProfileImage('');
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      username, 
      profileImage, 
      token,
      setUsername,
      setProfileImage,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);