import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function ProjectDetails({ api, user, isReadOnly = false }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [createTask, setCreateTask] = useState({
    nombre: "",
    usuarioAsignado: "",
    descripcion: "",
  });

  const [updateProject, setUpdateProject] = useState({
    nombre: "",
    descripcion: "",
  });

  const [showFormUpdate, setShowFormUpdate] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCreateTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChangeNewProject = (event) => {
    const { name, value } = event.target;
    setUpdateProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("ProjectDetails useEffect - Fetching project ID:", id);
    const fetchProject = async () => {
      try {
        const projectResponse = await api.get(`/projects/${id}`);
        console.log("Project response:", projectResponse.data);
        setProject(projectResponse.data);
        const tasksResponse = await api.get("/projects/task");
        console.log("Tasks response:", tasksResponse.data);
        setTasks(
          tasksResponse.data.filter((task) => task.id_proyecto === parseInt(id))
        );
      } catch (err) {
        const message = err.response?.data?.message || "Error fetching project";
        console.error("Project fetch error:", err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [api, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { nombre, descripcion } = updateProject;
    if (descripcion && nombre) {
      try {
        const response = await api.put(`/projects/${id}`, {
          nombre,
          descripcion,
        });
        console.log("Update project response:", response.data);
        setProject(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating project";
        console.error("Update project error:", err);
        setError(message);
      }
    } else if (!descripcion) {
      try {
        const response = await api.put(`/projects/${id}`, {
          nombre,
        });
        console.log("Update project response:", response.data);
        setProject(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating project";
        console.error("Update project error:", err);
        setError(message);
      } 
    } else if (!nombre) {
      try {
        const response = await api.put(`/projects/${id}`, {
          descripcion,
        });
        console.log("Update project response:", response.data);
        setProject(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating project";
        console.error("Update project error:", err);
        setError(message);
      } 
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const { nombre, descripcion } = createTask;

    const status = 0;

    try {
      const response = await api.post("/projects/task", {
        nombre,
        id_proyecto: parseInt(id),
        descripcion,
        estatus: status,
      });
      console.log("Create task response:", response.data.data);
      setTasks([...tasks, response.data.data]);
    } catch (err) {
      const message = err.response?.data?.message || "Error creating task";
      console.error("Create task error:", err);
      setError(message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Project: {project.nombre || "Unnamed Project"}</h2>
      <p>Description: {project.descripcion || "No Description"}</p>
      {user.role === "admin" && !isReadOnly && (
        <button onClick={() => setShowFormUpdate(true)}>Edit Project</button>
      )}

      {showFormUpdate && (
        <div className="update-project-form">
          <h3>Update project</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="nombre">New project name:</label>
              <div className="simple">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={updateProject.nombre}
                  onChange={handleInputChangeNewProject}
                />
              </div>
            </div>
            <div>
              <label htmlFor="descripcion">New project description:</label>
              <div className="simple">
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={updateProject.descripcion}
                  onChange={handleInputChangeNewProject}
                />
              </div>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowFormUpdate(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <h3>Tasks</h3>
      <button onClick={() => setShowForm(true)}>Create New Task</button>
      {showForm && (
        <div className="create-project-form">
          <h3>Create new Task</h3>
          <form onSubmit={handleCreateTask}>
            <div>
              <label htmlFor="nombre">Project name:</label>
              <div className="simple">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={createTask.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="descripcion">
                Asign a description for the new task:
              </label>
              <div className="simple">
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={createTask.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      <ul>
        {tasks.map((task) => (
          <div>
            <li key={task.id} style={{ padding: "1rem" }}>
              <Link to={`/${isReadOnly ? "my-tasks" : "tasks"}/${task.id}`}>
                {task.nombre}
              </Link>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetails;
