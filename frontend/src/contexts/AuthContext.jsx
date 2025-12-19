import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              me {
                id
                username
                email
                role
                employeeId
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        logout();
      } else {
        setUser(result.data.me);
        localStorage.setItem('authToken', token);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Login($usernameOrEmail: String!, $password: String!) {
              login(usernameOrEmail: $usernameOrEmail, password: $password) {
                token
                user {
                  id
                  username
                  email
                  role
                  employeeId
                }
              }
            }
          `,
          variables: { usernameOrEmail, password },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const { token, user: userData } = result.data.login;
      setUser(userData);
      localStorage.setItem('authToken', token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const isAdmin = () => user?.role?.toLowerCase() === 'admin';
  const isEmployee = () => user?.role?.toLowerCase() === 'employee';
  const isAuthenticated = () => !!user;

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isEmployee,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

