import { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import './AuthDialog.css';

interface LoginDialogProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginDialog = ({ onClose, onSwitchToRegister }: LoginDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-dialog-overlay">
      <div className="auth-dialog xp-window">
        <div className="xp-titlebar">
          <span className="xp-title">Login to Zerver</span>
          <button className="xp-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="xp-content">
          <form onSubmit={handleSubmit}>
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="xp-button"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
