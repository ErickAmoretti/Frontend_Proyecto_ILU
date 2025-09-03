import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function TaskDetails({ api, user }) {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [updateTask, setUpdateTask] = useState({
    name: "",
    descripcion: "",
    estatus: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("TaskDetails useEffect - Fetching task ID:", id);
    const fetchTask = async () => {
      try {
        const response = await api.get(`/projects/task/${id}`);
        console.log("Task response:", response.data);
        setTask(response.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error fetching task";
        console.error("Task fetch error:", err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [api, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!task) return;
    const { nombre, descripcion, estatus } = updateTask;
    if (nombre && descripcion && estatus) {
      try {
        const response = await api.put(`/projects/task/${id}`, {
          nombre,
          descripcion,
          estatus,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      } 
    } else if (!estatus && !descripcion) {
      try {
        const response = await api.put(`/projects/task/${id}`, {
          nombre,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      } 
    } else if (!descripcion && !nombre) {
      try {
        const response = await api.put(`/projects/task/${id}`, {
          estatus,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      } 
    } else if (!nombre && !estatus) {
        try {
        const response = await api.put(`/projects/task/${id}`, {
          descripcion,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      } 
    } else if (!nombre) {
      try {
        const response = await api.put(`/projects/task/${id}`, {
          descripcion,
          estatus,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      }
    } else if (!descripcion) {
      try {
        const response = await api.put(`/projects/task/${id}`, {
          nombre,
          estatus,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      }
    } else if (!estatus) {
      try {
        const response = await api.put(`/projects/task/${id}`, {
          nombre,
          descripcion,
        });
        console.log("Update response:", response.data);
        setTask(response.data.data);
      } catch (err) {
        const message = err.response?.data?.message || "Error updating task";
        console.error("Update error:", err);
        setError(message);
      }
    } 
  };

  console.log(
    "TaskDetails rendering - Task:",
    task,
    "Loading:",
    loading,
    "Error:",
    error
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!task) return <p>No task data available</p>;

  const taskStatus = () => {
    if (task.estatus == 0) {
      return <p>Task Pending</p>;
    } else if (task.estatus == 1) {
      return <p>Task Asigned</p>;
    } else {
      return <p>Task Completed</p>;
    }
  };

  return (
    <div>
      <h2>Task: {task.nombre || "Unnamed Task"}</h2>
      <p>Description: {task.descripcion || "Task has no description"}</p>
      <p>Project ID: {task.id_proyecto || "N/A"}</p>
      {taskStatus()}
      <button onClick={() => setShowForm(true)}>Edit Task</button>
      {showForm && (
        <div className="update-task-form">
          <h3>Update Task</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="nombre">Update task name:</label>
              <div className="simple">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={updateTask.nombre}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="descripcion">
                Asign a new description for the current task:
              </label>
              <div className="simple"></div>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={updateTask.descripcion}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="estatus">
                Asign a new state for the task:
              </label>
              <div className="simple">
                <input
                  type="text"
                  id="usuarioAsignado"
                  name="estatus"
                  value={updateTask.estatus}
                  onChange={handleInputChange}
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
    </div>
  );
}

export default TaskDetails;
