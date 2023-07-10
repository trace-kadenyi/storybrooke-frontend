import React, { useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

import Logout from "../Logout";
import "./navbar.css";
import logo from "../../Assets/Images/logo.png";

const MainNavbar = () => {
  const location = useLocation();

  // display none for missing links
  const missingLinks = document.querySelector(".main_read_share");
  if (missingLinks === "") {
    missingLinks.style.display = "none";
  }

  // remove active class from active link
  useEffect(() => {
    const activeLink = document.querySelector(".active");
    if (activeLink) {
      activeLink.classList.remove("active");
      activeLink.classList.add("activated");
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleToggle = () => {
    const toggle = document.getElementById("toggle");
    const toggler = document.getElementById("main_nav");
    toggle.classList.toggle("nav_active");
    toggler.classList.toggle("nav_active");
  };

  return (
    <header className="main_navbar">
      <nav id="main_nav">
        <Link to="/" className="nav_logo_link">
          <img src={logo} alt="logo" className="nav_logo" />
        </Link>
        <ul>
          {/* search bar */}
          <div>
          <li className="main_navbar_search">
            <form className="search_form">
              <input
                type="text"
                placeholder="Search for users"
                className="search_input"
                autoFocus
              />
              <button type="submit" className="nav_search_btn">
                <BsSearch className="nav_search_icon" />
              </button>
            </form>
          </li>
          </div>
          <div className="main_nav_li">
          {/* home page */}
          <li className="main_navbar_list">
            <NavLink to="/" className="main_link">
              Home
            </NavLink>
          </li>

          {/* about page */}
          <li className="main_navbar_list">
            <NavLink to="/about" className="main_link">
              About
            </NavLink>
          </li>

          {/* read stories page */}
          <li className="main_navbar_list">
            <NavLink to="/read" className="main_link">
              Read
            </NavLink>
          </li>

          {/* share stories page */}
          <li className="main_navbar_list">
            <NavLink to="/share" className="main_link">
              Share
            </NavLink>
          </li>
          <li className="main_navbar_list">
            <NavLink to="/profile" className="main_link">
              Profile
            </NavLink>
          </li>

          {/* logout page */}
          <li className="main_navbar_list logout_nav_btn">
            <Logout />
          </li>
          </div>
        </ul>
      </nav>
      <div id="toggle" onClick={handleToggle}></div>
    </header>
  );
};

export default MainNavbar;
