import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import logo from "../../Assets/Images/logo.png";
import "./register_login.css";
import axios from "../../Api/axios";
import preloader from "../../Assets/Images/submit.gif";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked

  const newName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    setResponse("");
  }, [name, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadSubmit(true);
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          user: newName,
          pwd: password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setResponse(response.data.message);
      // console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const interests = response?.data?.interests;
      setAuth({ name, password, roles, interests, accessToken });
      setName("");
      setPassword("");
      showToastMessage();
      localStorage.setItem("user", JSON.stringify(newName));
      navigate(from, { replace: true });
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 401) {
        setResponse("Unauthorized");
      } else if (error.response.status === 400) {
        setResponse("Both username and password are required");
      } else if (error.response.status === 404) {
        setResponse("Username not found");
      } else {
        setResponse("Something went wrong");
      }
    }
    setLoadSubmit(false);
  };

  const showToastMessage = () => {
    toast.success(`Welcome ${newName} 😃`, {
      position: toast.POSITION.TOP_RIGHT,
      className: "toast-message",
    });
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section className="registration">
      <header className="login_header">
        <nav>
          <img src={logo} alt="logo" className="register_login_logo" />
          <ul>
            <li>
              <NavLink to="/register" className="link register_link">
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
              className="input"
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
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="devise_container">
            <input
              type="checkbox"
              name="persist"
              id="persist"
              checked={persist}
              onChange={togglePersist}
              className="devise-checked"
            />
            <label htmlFor="persist" className="devise">
              Trust this device
            </label>
          </div>
          {/* submit */}
          <div className="story_submit_div">
            <button type="submit" className="submit">
              <span>Login</span>
              {/* preloader span */}
              {loadSubmit && (
                <span className="preloader_span">
                  <img src={preloader} alt="preloader" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
