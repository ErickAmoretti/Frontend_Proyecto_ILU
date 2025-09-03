import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProjectsList({ api, user, isMyProjects = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState({
    nombre: "",
    usuarioAsignado: "",
    descripcion: ""
  })

  useEffect(() => {
    console.log('ProjectsList useEffect - Fetching projects, isMyProjects:', isMyProjects);
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        console.log('Projects response:', response.data);
        setProjects(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Error fetching projects';
        console.error('Projects fetch error:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [api]);

  const handleInputChange = (event) =>{
    const {name, value} = event.target;
    setNewProject(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    
    const {nombre, usuarioAsignado, descripcion} = newProject;

    if (!nombre || !usuarioAsignado || !descripcion) {
      setError("Todos los campos son obligatorios!")
      return
    }
    
    try {
      const response = await api.post('/projects', { nombre, id_usuario: usuarioAsignado, descripcion }); 
      setProjects([...projects, response.data.data]);
      navigate(`/projects/${response.data.data.id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Error creating project';
      console.error('Create project error:', err);
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);  
      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      const message = err.response?.data?.message || 'Error deleting project';
      console.error('Delete project error:', err);
      setError(message);
    }
  };

  console.log('ProjectsList rendering - Projects:', projects, 'Loading:', loading, 'Error:', error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{isMyProjects ? 'My Projects' : 'All Projects'}</h2>
      {user.role === 'admin' && (
        <>
          <button className='createProjectButton' onClick={() => setShowForm(true)}>Create New Project</button>
        </>
      )}

      {showForm && (
        <div className="create-project-form">
          <h3>Create new project</h3>
          <form onSubmit={handleCreate}>
            <div>
              <label htmlFor="nombre">Project name:</label>
              <div className='simple'>
              <input type="text" id='nombre' name='nombre' value={newProject.nombre} onChange={handleInputChange} required/>
              </div>
            </div>
            <div>
              <label htmlFor="usuarioAsignado">Asign a user for the project:</label>
              <div className='simple'>
              <input type="text" id='usuarioAsignado' name='usuarioAsignado' value={newProject.usuarioAsignado} onChange={handleInputChange} required />
              </div>
            </div>
            <div>
              <label htmlFor="descripcion">Asign a description for the new project:</label>
              <div className='simple'>
              <input type="text" id="descripcion" name='descripcion' value={newProject.descripcion} onChange={handleInputChange} required />
              </div>
            </div>
            <button type='submit'>Save</button>
            <button type='button' onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/${isMyProjects ? 'my-projects' : 'projects'}/${project.id}`}>
              {project.nombre} {user.role === 'admin' && `(Assigned to: ${project.id_usuario})`}
            </Link>
            {user.role === 'admin' && (
              <>
                <li>
                <button onClick={() => navigate(`/projects/${project.id}`)}>Edit</button>
                <button onClick={() => handleDelete(project.id)}>Delete</button>
                </li>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsList;