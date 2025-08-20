import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created (demo)!");
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
