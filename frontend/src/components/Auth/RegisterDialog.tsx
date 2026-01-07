import { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import './AuthDialog.css';

interface RegisterDialogProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterDialog = ({ onClose, onSwitchToLogin }: RegisterDialogProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({ username, email, password });
      setAuth(response.user, response.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-dialog-overlay">
      <div className="auth-dialog xp-window">
        <div className="xp-titlebar">
          <span className="xp-title">Register for Zerver</span>
          <button className="xp-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="xp-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={50}
                className="xp-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="xp-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="xp-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="xp-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                type="submit"
                disabled={loading}
                className="xp-button primary"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="xp-button"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
