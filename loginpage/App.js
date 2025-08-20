import React, { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="app-container">
      {/* Brand Outside the Card */}
      <h1 className="brand">NEONMIND</h1>

      {/* Auth Card */}
      <div className="card">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="subtitle">
          {isLogin
            ? "Login to continue your journey"
            : "Sign up and join the NEONMIND experience"}
        </p>

        <form className="form">
          {!isLogin && (
            <input type="text" placeholder="Full Name" className="input" />
          )}
          <input type="email" placeholder="Email Address" className="input" />
          <input type="password" placeholder="Password" className="input" />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
            />
          )}

          <button type="submit" className="btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
