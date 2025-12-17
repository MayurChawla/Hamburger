import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials.usernameOrEmail, credentials.password);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Employee Management</h1>
        <p className="login-subtitle">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={credentials.usernameOrEmail}
              onChange={handleChange}
              required
              placeholder="Enter username or email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-info">
          <div className="demo-accounts">
            <h3>Demo Accounts:</h3>
            <div className="account">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="account">
              <strong>Employee:</strong> john_doe / employee123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

