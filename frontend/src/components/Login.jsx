import React, { useContext } from "react";
import { Context } from "../UserContext";
import axios from "axios";
import "../styles/Login.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

function Login() {
  const { logged, setLogged } = useContext(Context);

  function handleLogin() {
    window.location.href = `${backendURL}/auth/google`;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome to QueCards</h1>
        <p className="login-subtitle">
          Sign in to create and revise your flashcards
        </p>

        <button className="google-login-btn" onClick={handleLogin}>
          <span className="google-icon">G</span>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;