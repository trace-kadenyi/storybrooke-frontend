import React from "react";
import { NavLink, Link } from "react-router-dom";

import logo from "../../../../Assets/Images/logo.png";
import Logout from "../../../Logout";
import "./mainpage.css";

const MainPage = () => {
  return (
    <section className="stories_sect">
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
          <ul>
            <li>
              <NavLink to="/" className="link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="link">
                About
              </NavLink>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </nav>
      </header>
      <div className="stories_div">
        <p className="interests stories_title">
          Welcome!
          <br /> This is where you can read stories from the community or share
          your own stories. Click either of the buttons below to get started.
        </p>
        <div className="stories_btns">
          <button>
            <NavLink to="/explore" className="stories_btn">
              Read Stories
            </NavLink>
          </button>
          <button>
            <NavLink to="/share" className="stories_btn">
              Share Stories
            </NavLink>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainPage;
