import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Redux/userSlice";

import "./registration.css";

const Registration = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "success") {
      alert("Registration successful");
      setName("");
      setPassword("");
    } else if (status === "failed") {
      alert("User already exists. Try another name.");
    }
  }, [status]);

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

export default Registration;
