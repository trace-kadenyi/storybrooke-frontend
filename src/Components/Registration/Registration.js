import React from "react";

import "./registration.css";

const Registration = () => {
  return (
    <section className="registration">
      <h1>Registration</h1>
      <form className="register_form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
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
