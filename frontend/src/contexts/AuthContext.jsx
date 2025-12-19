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

      if (!response.ok) {
        // Server returned an error status
        // Only logout on 401/403 (authentication errors)
        if (response.status === 401 || response.status === 403) {
          console.error('Token validation failed: Unauthorized');
          logout();
        } else {
          // Other server errors - might be temporary, keep token
          console.warn('Token validation: Server error', response.status);
          setUser(null);
        }
        return;
      }

      const result = await response.json();

      // Check for GraphQL errors
      if (result.errors) {
        // Check if any error is authentication-related
        const authError = result.errors.some(
          error => error.message.toLowerCase().includes('authentication') || 
                   error.message.toLowerCase().includes('unauthorized') ||
                   error.message.toLowerCase().includes('token') ||
                   error.message.toLowerCase().includes('expired') ||
                   error.message.toLowerCase().includes('invalid')
        );
        
        if (authError) {
          console.error('Token validation failed: Authentication error');
          logout();
        } else {
          // Other GraphQL errors - might be temporary, keep token
          console.warn('Token validation warning:', result.errors);
          setUser(null);
        }
      } else if (result.data && result.data.me) {
        // Successfully validated - user is authenticated
        setUser(result.data.me);
        localStorage.setItem('authToken', token);
      } else if (result.data && result.data.me === null) {
        // Token was sent but no user returned - token is invalid
        console.warn('Token validation: Invalid token (no user returned)');
        logout();
      } else {
        // Unexpected response format
        console.warn('Token validation: Unexpected response format');
        setUser(null);
      }
    } catch (error) {
      // Network errors or other fetch failures
      // Don't logout on network errors - might be temporary connection issue
      console.error('Token validation failed (network error):', error);
      // Keep the token in localStorage but don't set user
      // This allows the user to retry when network is back
      setUser(null);
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

