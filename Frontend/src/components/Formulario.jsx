import "./Formulario.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Formulario({ setUser, user }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (correo == "" || password == "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        correo,
        password,
      });
      if (response.data.message == "login success") {
        const newUser = ({
          id: response.data.access_token,
          user: response.data.nombre,
          role: response.data.role,
        });
        setUser(newUser)
        localStorage.setItem("token", response.data.access_token)
        setError("");
        navigate("/")
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status == 401) {
        setError("Wrong email or password")
      } else {
        setError("Error connecting to server")
      }
      console.error(err)
    }
  };

  return (
    <section>
      <h1>Login</h1>
      {/*Por aqui estoy enviando a mi funcion el Email y el password */}
      <form className="formulario" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Iniciar Sesion</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
