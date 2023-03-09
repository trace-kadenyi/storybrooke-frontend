import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// import "./login.css";

import axios from "../../Api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    setResponse("");
  }, [name, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user: name, pwd: password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setResponse(response.data.message);
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ name, password, roles, accessToken });
      setName("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 401) {
        setResponse("Unauthorized");
      } else if (error.response.status === 400) {
        setResponse("Both username and password are required");
      } else {
        setResponse("Something went wrong");
      }
    }
  };

  return (
    <section className="registration">
      <h1>Login</h1>
      <form className="register_form" onSubmit={handleSubmit}>
        <div>
          <h2 className="response">{response}</h2>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button className="submit" type="submit">
            Login
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;
