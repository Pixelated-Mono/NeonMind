import React from "react";
import { Link } from "react-router-dom";

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successful (demo)!");
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
