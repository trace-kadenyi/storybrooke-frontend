import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Context/AuthProvider";

import "./login.css";

import axios from "../../Api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
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
    <>
      {success ? (
        <section className="succesful_registration">
          <div>
            <h1>Login Successful</h1>
            <Link to="/">Go to Home</Link>
          </div>
        </section>
      ) : (
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
      )}
    </>
  );
};

export default Login;
