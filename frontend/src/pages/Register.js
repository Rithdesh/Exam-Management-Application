import { useState } from "react";
import API from "../api/api";
import authBg from "../assets/auth-bg.jpg";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const handleRegister = async () => {
    try {
      await API.post("/users/register", {
        name,
        email,
        password,
        roles: [role],
      });

      alert("Registration successful. Please login.");
      window.location.href = "/";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-box">
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
          <option value="EXAMINER">Examiner</option>
        </select>

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Register;
