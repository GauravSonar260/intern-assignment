import { useState } from 'react';
import API from './api';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    
    try {
      const { data } = await API.post(endpoint, { username, password });
      
      if (isLogin) {
        const token = data.access_token || data.token || data.accessToken;
        if (!token) {
            alert('Login failed: Server sent no token.');
            return;
        }
        localStorage.setItem('token', String(token));
        localStorage.setItem('role', data.role);
        navigate('/dashboard');
      } else {
        alert('Registration Successful! Please Login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'An error occurred');
    }
  };

  // --- PASTEL STYLES ---
  const styles = {
    container: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F3E5F5', // Pastel Purple Background
      margin: 0,
      position: 'absolute',
      top: 0,
      left: 0
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(156, 39, 176, 0.15)',
      width: '100%',
      maxWidth: '380px',
      textAlign: 'center',
      border: '1px solid #E1BEE7'
    },
    title: {
      color: '#6A1B9A',
      marginBottom: '1.5rem',
      fontSize: '2rem',
      fontWeight: 'bold',
      fontFamily: 'Segoe UI, sans-serif'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      marginBottom: '15px',
      borderRadius: '12px',
      border: '2px solid #F3E5F5',
      backgroundColor: '#FAFAFA',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s',
      color: '#333333' // <--- FIXED: Forces text to be Dark Grey
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#CE93D8',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 4px 10px rgba(206, 147, 216, 0.4)'
    },
    switchBtn: {
      marginTop: '20px',
      background: 'none',
      border: 'none',
      color: '#AB47BC',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={styles.input}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input}
            />
          </div>
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#BA68C8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#CE93D8'}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default Auth;