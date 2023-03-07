import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { registerUser } from "../../Redux/registerUserSlice";

import "./register.css";

const Register = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  // handle status change
  useEffect(() => {
    if (status === "loading") {
      setResponse("Loading...");
    } else if (status === "success") {
      setResponse(`User ${name} created successfully. Login to continue...`);
      setName("");
      setPassword("");
    } else if (status === "failed") {
      setResponse(`User ${name} already exists. Please try another name.`);
    }
  }, [status]);

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      user: name,
      pwd: password,
    };
    dispatch(registerUser(newUser));
  };

  return (
    <section className="registration">
      <h1>Registration</h1>
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
            Register
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
