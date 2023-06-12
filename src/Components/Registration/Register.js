import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

import axios from "../../Api/axios";
import logo from "../../Assets/Images/logo.png";
import preloader from "../../Assets/Images/submit.gif";
import "../Authentication/register_login.css";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [response, setResponse] = useState("");
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked
  const REGISTER_URL = "/register";

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  useEffect(() => {
    setResponse("");
  }, [firstName, lastName, userName, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (firstName.length < 3 || lastName.length < 3 || userName.length < 3) {
      setResponse(
        "First name, last name, and username must be at least 3 characters long"
      );
      return;
    } else if (!PWD_REGEX.test(password)) {
      setResponse(
        "Password must be 8-24 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    } else if (password !== confirmPassword) {
      setResponse("Passwords do not match");
      return;
    }
    setLoadSubmit(true);

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          user: userName,
          pwd: password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setFirstName("");
      setLastName("");
      setUserName("");
      setPassword("");
      setConfirmPassword("");
      showToastMessage();
      navigate("/login", { replace: true });
    } catch (error) {
      if (!error.response) {
        setResponse("No response from server");
      } else if (error.response.status === 409) {
        setResponse("User already exists");
      } else {
        setResponse("Something went wrong. Please try again later.");
      }
    }
    setLoadSubmit(false);
  };

  const showToastMessage = () => {
    toast.success(`Registration successful 🤝 Please log in to continue.`, {
      position: toast.POSITION.TOP_RIGHT,
      className: "toast-message",
    });
  };

  return (
    <section className="registration">
      <header className="login_header">
        <nav>
          <img src={logo} alt="logo" className="logo" />
          <ul>
            <li>
              <NavLink to="/login" className="link register_link">
                Login
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
          {/* first name */}
          <div>
            <label htmlFor="firstname" aria-hidden="false" className="label">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              autoComplete="off"
              placeholder="Enter your first name"
              value={firstName}
              className="input"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          {/* last name */}
          <div>
            <label htmlFor="lastname" aria-hidden="false" className="label">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              autoComplete="off"
              placeholder="Enter your last name"
              value={lastName}
              className="input"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          {/* user name */}
          <div>
            <label htmlFor="username" aria-hidden="false" className="label">
              User Name
            </label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              placeholder="Select your username"
              value={userName}
              className="input"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          {/* password */}
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
          {/* confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              aria-hidden="false"
              className="label"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              className="input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {/* submit button */}
          <div className="story_submit_div">
            <button type="submit" className="submit">
              <span>Register</span>
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

export default Register;
