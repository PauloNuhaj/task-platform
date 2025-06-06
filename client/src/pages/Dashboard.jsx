import React, { useEffect, useState } from 'react';
import API from '../api/authApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
  });

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Gabim gjatë marrjes së detyrave!');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Gabim gjatë marrjes së userave:', err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchTasks();
      if (user?.role === 'manager') {
        fetchUsers();
      }
    }
  }, [token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/tasks', newTask);
      setTasks([res.data, ...tasks]);
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
      });
      toast.success('Task u shtua me sukses!');
    } catch (err) {
      toast.error('Gabim gjatë shtimit të task!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success('Task u fshi me sukses!');
    } catch {
      toast.error('Gabim gjatë fshirjes së task!');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
      toast.success('Statusi i task u përditësua!');
    } catch {
      toast.error('Gabim gjatë përditësimit të task!');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Mirësevjen, {user?.name}</h2>

      {/* Manager - form për të caktuar task për user tjetër */}
      {user?.role === 'manager' && (
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
          <label>Zgjidh punonjësin:</label>
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            required
          >
            <option value="">-- Zgjidh --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>

          <label>Zgjidh datën:</label>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            required
          />
          <button type="submit">Shto Detyrë</button>
        </form>
      )}

      {/* User - shfaq kalendarin */}
      {user?.role === 'user' && (
        <>
          <h3>Kalendar i detyrave:</h3>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={tasks.map((task) => ({
              title: task.title,
              date: task.dueDate,
            }))}
          />
        </>
      )}

      {/* Lista e detyrave (për të dy rolet) */}
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task._id} className={`task ${task.completed ? 'completed' : ''}`}>
            <h4>{task.title}</h4>
            {task.description && <p>{task.description}</p>}
            <p><strong>Përcaktuar për:</strong> {task.assignedTo?.name || ''}</p>
            <p><strong>Data:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
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