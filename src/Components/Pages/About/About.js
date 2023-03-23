import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../../Assets/Images/logo.png";
import "./about.css";

const About = () => {
  const navigate = useNavigate();
  return (
    <section className="about_sect">
      <header className="login_header">
        <nav>
          <img src={logo} alt="logo" className="logo about_header_logo" />
          <ul>
            <li>
              <NavLink to="/" className="link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className="link">
                Login
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
      <div className="about_main_sect">
        <div className="about_main_image">
          <img src={logo} alt="logo" className="about_logo" />
        </div>
        <div className="about_main_content">
          <p>
            Life is one great big story. There are stories all around us and
            inside us if we take the time to look. In fact, I reckon we're all
            storytellers. In these pages you will get the chance to read other
            people's stories and, if you're so inclined, I hope that you will
            share your own. Use this platform to write. Let your imagination run
            wild here and write anything and everything that makes sense to you.
            Who knows, you might just find like-minded people who will enjoy
            reading your stories as much as you enjoy writing them. Find your
            voice. Tell me a story...
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
