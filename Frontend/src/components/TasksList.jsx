import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function TasksList({ api, user, isMyTasks = false }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('TasksList useEffect - Fetching tasks, isMyTasks:', isMyTasks);
    const fetchTasks = async () => {
      try {
        const response = await api.get('/projects/task'); 
        console.log('Tasks response:', response.data);
        setTasks(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Error fetching tasks';
        console.error('Tasks fetch error:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [api, isMyTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/projects/task/${id}`); 
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      const message = err.response?.data?.message || 'Error deleting task';
      console.error('Delete error:', err);
      setError(message);
    }
  };

  console.log('TasksList rendering - Tasks:', tasks, 'Loading:', loading, 'Error:', error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{isMyTasks ? 'My Tasks' : 'All Tasks'}</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <Link to={`/${isMyTasks ? 'my-tasks' : 'tasks'}/${task.id}`}>
              {task.nombre} {user.role === 'admin' && `(Project: ${task.id_proyecto})`}
            </Link>
            <li>
            <button style={{}} onClick={() => navigate(`/${isMyTasks ? 'my-tasks' : 'tasks'}/${task.id}`)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksList;