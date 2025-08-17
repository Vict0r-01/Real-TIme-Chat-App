'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize state without sessionStorage
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Move sessionStorage operations to useEffect
  useEffect(() => {
    // Initialize state from sessionStorage
    setUsername(sessionStorage.getItem('username') || '');
    setProfileImage(sessionStorage.getItem('profileImage') || '');
    setToken(sessionStorage.getItem('token') || '');
    setIsDemoMode(sessionStorage.getItem('demoMode') === 'true');
    setIsLoading(false);

    // Check JWT token
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      if (decodedToken?.sub && !username) {
        setUsername(decodedToken.sub);
      }
    }
  }, []);

  // Persist to sessionStorage when values change
  useEffect(() => {
    if (!isLoading) {
      if (username) sessionStorage.setItem('username', username);
      if (profileImage) sessionStorage.setItem('profileImage', profileImage);
      if (token) sessionStorage.setItem('token', token);
      if (isDemoMode) sessionStorage.setItem('demoMode', isDemoMode.toString());
    }
  }, [username, profileImage, token, isLoading]);

  const login = (newToken, newUsername, newProfileImage, isDemoMode = false) => {
    setToken(newToken);
    setUsername(newUsername);
    setProfileImage(newProfileImage);
    setIsDemoMode(isDemoMode);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('profileImage');
    sessionStorage.removeItem('demoMode');
    setToken('');
    setUsername('');
    setProfileImage('');
    setIsDemoMode(false);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      username, 
      profileImage, 
      token,
      isDemoMode,
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