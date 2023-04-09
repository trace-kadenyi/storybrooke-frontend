import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

import logo from "../../../Assets/Images/logo.png";
import Logout from "../../Logout";
import "./stories.css"

const StoriesPage = () => {
  const navigate = useNavigate();
  return (
    <section className="stories_sect">
      <header className="login_header">
        <nav>
          <img src={logo} alt="logo" className="logo" />
          <ul>
            <li>
              <NavLink to="/about" className="link">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/editor" className="link">
                Editor
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin" className="link">
                Admin
              </NavLink>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </nav>
      </header>
    </section>
  );
};

export default StoriesPage;
