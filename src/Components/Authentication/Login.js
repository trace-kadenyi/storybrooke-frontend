import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";

import "./login.css";

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
      showToastMessage();
      localStorage.setItem("user", JSON.stringify(name));
      navigate(from, { replace: true });
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 401) {
        setResponse("Unauthorized");
      } else if (error.response.status === 400) {
        setResponse("Both username and password are required");
      } else if (error.response.status === 404) {
        setResponse("User not found");
      } else {
        setResponse("Something went wrong");
      }
    }
  };

  const showToastMessage = () => {
    toast.success(`Welcome ${name} 😃!`, {
      position: toast.POSITION.TOP_RIGHT,
      className: "toast-message",
    });
  };

  return (
    <section className="registration">
      <header className="login_header">
        <nav>
          <img
            src="https://www.freepnglogos.com/uploads/instagram-logo-png-transparent-0.png"
            alt="logo"
            className="logo"
          />
          <ul>
            <li>
              <NavLink to="/about" className="link">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="link">
                Register
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <div className="login_sect">
        <form className="register_form" onSubmit={handleSubmit}>
          <div>
            <h2 className="response">{response}</h2>
          </div>
          <div>
            <label htmlFor="name" aria-hidden="false" className="label">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" aria-hidden="false" className="label">
              Password
            </label>
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
      </div>
    </section>
  );
};

export default Login;
