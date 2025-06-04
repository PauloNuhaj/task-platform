import React, { useEffect, useState } from 'react';
import API from '../api/authApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Gabim gjatë marrjes së detyrave:', err.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/tasks', newTask);
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      alert('Gabim gjatë shtimit të detyrës');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch {
      alert('Gabim gjatë fshirjes');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch {
      alert('Gabim gjatë përditësimit');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Mirësevjen, {user?.name}</h2>

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Titulli i detyrës"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Përshkrimi (opsional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button type="submit">Shto Detyrë</button>
      </form>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task._id} className={`task ${task.completed ? 'completed' : ''}`}>
            <h4>{task.title}</h4>
            {task.description && <p>{task.description}</p>}
            <div className="task-actions">
              <button onClick={() => handleToggleComplete(task)}>
                {task.completed ? 'Zgjidhe si e paplotësuar' : 'Përfundo'}
              </button>
              <button onClick={() => handleDelete(task._id)}>Fshi</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;