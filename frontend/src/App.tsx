import { useState, useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { Desktop } from './components/Desktop/Desktop';
import { LoginDialog } from './components/Auth/LoginDialog';
import { RegisterDialog } from './components/Auth/RegisterDialog';
import { GamePlayer } from './components/Emulator/GamePlayer';
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Show login dialog if not authenticated
    if (!isAuthenticated) {
      setShowLogin(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        {showLogin && (
          <LoginDialog
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <RegisterDialog
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
        {!showLogin && !showRegister && (
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #2c1810 0%, #4a3228 100%)',
            }}
          >
            <button
              onClick={() => setShowLogin(true)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                background: '#3596ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Login to Zerver
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Desktop />
      <GamePlayer />
    </>
  );
}

export default App;
