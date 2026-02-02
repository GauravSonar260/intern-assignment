import { useEffect, useState } from 'react';
import API from './api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'User';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;

    try {
      await API.post('/tasks', { title: newTask });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      alert('Error adding task: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // --- PASTEL DASHBOARD STYLES ---
  const styles = {
    page: {
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#F3E5F5', // Pastel Purple Background
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'Segoe UI, sans-serif'
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 10px 25px rgba(156, 39, 176, 0.1)',
      border: '1px solid #E1BEE7'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderBottom: '2px solid #F3E5F5',
      paddingBottom: '1rem'
    },
    title: {
      color: '#6A1B9A', // Deep Purple
      margin: 0,
      fontSize: '2rem'
    },
    logoutBtn: {
      backgroundColor: '#E1BEE7',
      color: '#4A148C',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    inputGroup: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      backgroundColor: '#FAFAFA',
      padding: '15px',
      borderRadius: '15px'
    },
    input: {
      flex: 1,
      padding: '12px',
      borderRadius: '10px',
      border: '2px solid #E1BEE7',
      outline: 'none',
      fontSize: '1rem',
      color: '#999393' // Dark text for visibility
    },
    addBtn: {
      backgroundColor: '#CE93D8',
      color: 'white',
      border: 'none',
      padding: '0 25px',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    list: {
      listStyle: 'none',
      padding: 0
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      borderBottom: '1px solid #F3E5F5',
      transition: 'background 0.2s'
    },
    taskText: {
      fontSize: '1.1rem',
      color: '#424242'
    },
    status: {
      fontSize: '0.85rem',
      padding: '4px 8px',
      borderRadius: '12px',
      marginLeft: '10px',
      backgroundColor: '#FFF3E0', // Soft Orange for pending
      color: '#EF6C00'
    },
    deleteBtn: {
      backgroundColor: '#EF9A9A', // Soft Red
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Task Dashboard</h1>
            <p style={{color: '#9E9E9E', margin: '5px 0 0 0'}}>Welcome, <strong>{role}</strong></p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        {/* ADD TASK INPUT */}
        <div style={styles.inputGroup}>
          <form onSubmit={handleAddTask} style={{display: 'flex', width: '100%', gap: '10px'}}>
            <input 
              type="text" 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="What needs to be done?" 
              style={styles.input}
            />
            <button type="submit" style={styles.addBtn}>Add</button>
          </form>
        </div>

        {/* TASK LIST */}
        <ul style={styles.list}>
          {tasks.length === 0 ? (
            <p style={{textAlign: 'center', color: '#BDBDBD'}}>No tasks yet. Add one above!</p>
          ) : tasks.map((task) => (
            <li key={task.id} style={styles.listItem}>
              <div>
                <span style={styles.taskText}><strong>{task.title}</strong></span>
                <span style={styles.status}>{task.status}</span>
                {role === 'admin' && task.owner && (
                  <div style={{ fontSize: '0.8em', color: '#BDBDBD', marginTop: '4px' }}>Owner: {task.owner}</div>
                )}
              </div>
              
              <button 
                onClick={() => handleDelete(task.id)}
                style={styles.deleteBtn}
                onMouseOver={(e) => e.target.style.backgroundColor = '#E57373'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#EF9A9A'}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default Dashboard;