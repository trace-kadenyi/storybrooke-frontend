import React from "react";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";

import logo from "../../Assets/Images/logo.png";
import Logout from "../Logout";
import "./navbar.css";

const MainNavbar = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  // display none for missing links
  const missingLinks = document.querySelector(".main_read_share");
  if (missingLinks === "") {
    missingLinks.style.display = "none";
  }

  return (
    <header className="main_navbar">
      <nav>
        <ul>
          {/* add back link */}
          {/* <li
            className="main_navbar_list"
            onClick={() => navigate(from, { replace: true })}
          >
            Back
          </li> */}
          <li>
            <NavLink to="/" className="main_link">
              Home
            </NavLink>
          </li>
          {/* navigate between read and share pages */}
          <li className="main_navbar_list main_read_share">
            {location.pathname == "/read" ? (
              <NavLink to="/share" className="main_link">
                Share
              </NavLink>
            ) : location.pathname == "/share" ||
              location.pathname == "/profile" ? (
              <NavLink to="/read" className="main_link">
                Explore
              </NavLink>
            ) : location.pathname == "/explore" ||
              location.pathname == "/my_stories" ||
              location.pathname == "/by_genre" ||
              location.pathname == "by_title" ||
              location.pathname == "/by_author" ||
              location.pathname == "/by_title" ? (
              <NavLink to="/main" className="main_link">
                Main
              </NavLink>
            ) : null}
          </li>
          {/* about page */}
          <li className="main_navbar_list">
            <NavLink to="/about" className="main_link">
              About
            </NavLink>
          </li>
          {/* profile page */}
          <li className="main_navbar_list">
            {location.pathname !== "/profile" ? (
              <NavLink to="/profile" className="main_link">
                Profile
              </NavLink>
            ) : (
              <NavLink to="/share" className="main_link">
                Share
              </NavLink>
            )}
          </li>
          {/* editor page */}
          <li className="main_navbar_list">
            <NavLink to="/editor" className="main_link">
              Editor
            </NavLink>
          </li>
          {/* admin page */}
          <li className="main_navbar_list">
            <NavLink to="/Admin" className="main_link">
              Admin
            </NavLink>
          </li>
          {/* logout page */}
          <li className="main_navbar_list">
            <Logout />
          </li>
          {/* <li className="main_link">
            Welcome back {currentUser}!
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavbar;
