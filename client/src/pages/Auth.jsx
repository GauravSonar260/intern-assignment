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
      
      // DEBUG: This prints the server's response to your console
      console.log("SERVER RESPONSE:", data);

      if (isLogin) {
        // Check all possible names for the token
        const token = data.access_token || data.token || data.accessToken;
        
        if (!token) {
            alert('Error: Server sent no token! Check Console.');
            return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('role', data.role);
        
        alert('Login Successful!');
        navigate('/dashboard');
      } else {
        alert('Registration Successful! Please Login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
            <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
            {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

export default Auth;