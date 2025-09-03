import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from 'react-router-dom';
import axios from 'axios';
import { Formulario } from './components/Formulario';
import { Home } from './components/Home';
import ProjectsList from './components/ProjectsList';
import ProjectDetails from './components/ProjectDetails';
import TasksList from './components/TasksList';
import TaskDetails from './components/TaskDetails';
import './App.css';
import React from 'react';

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Error: {this.state.error?.message || 'Something went wrong'}</h1>;
    }
    return this.props.children;
  }
}

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    setUser(null);
  };


  return (
    <Router>
      <ErrorBoundary>
        <div className="app-container">
          <Routes>
            <Route path="/auth/login" element={<Formulario setUser={setUser} />} />
            {user ? (
              <>
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar user={user} logout={logout} />
                      <main>
                        <Home user={user} />
                      </main>
                    </>
                  }
                />
                {user.role === 'admin' && (
                  <>
                    <Route
                      path="/projects"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <ProjectsList api={api} user={user} />
                          </main>
                        </>
                      }
                    />
                    <Route
                      path="/projects/:id"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <ProjectDetails api={api} user={user} />
                          </main>
                        </>
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <TasksList api={api} user={user} />
                          </main>
                        </>
                      }
                    />
                    <Route
                      path="/tasks/:id"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <TaskDetails api={api} user={user} />
                          </main>
                        </>
                      }
                    />                    
                  </>
                )}
                {user.role === 'normal' && (
                  <>
                    <Route
                      path="/my-projects"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <ProjectsList api={api} user={user} isMyProjects />
                          </main>
                        </>
                      }
                    />
                    <Route
                      path="/my-projects/:id"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <ProjectDetails api={api} user={user} isReadOnly />
                          </main>
                        </>
                      }
                    />
                    <Route
                      path="/my-tasks"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <TasksList api={api} user={user} isMyTasks />
                          </main>
                        </>
                      }
                    />
                    <Route
                      path="/my-tasks/:id"
                      element={
                        <>
                          <Navbar user={user} logout={logout} />
                          <main>
                            <TaskDetails api={api} user={user} />
                          </main>
                        </>
                      }
                    />
                  </>
                )}
                <Route path="/auth/login" element={<Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/auth/login" />} />
            )}
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

function Navbar({ user, logout }) {
  console.log('Navbar rendering - User:', user);
  if (!user) return null; // Prevent rendering if user is null
  return (
    <nav className="navbar">
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          gap: '20px',
          padding: '10px',
        }}
      >
        <li>
          <Link to="/">Home</Link>
        </li>
        {user.role === 'admin' ? (
          <>
            <li>
              <Link to="/projects">All Projects</Link>
            </li>
            <li>
              <Link to="/tasks">All Tasks</Link>
            </li>
          </>
        ) : user.role === 'normal' ? (
          <>
            <li>
              <Link to="/my-projects">My Projects</Link>
            </li>
            <li>
              <Link to="/my-tasks">My Tasks</Link>
            </li>
          </>
        ) : null}
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default App;