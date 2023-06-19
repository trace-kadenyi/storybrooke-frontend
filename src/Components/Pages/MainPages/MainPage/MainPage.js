import React from "react";
import { NavLink, Link } from "react-router-dom";

import MainNavbar from "../../../Navigation/MainNavbar";
import logo from "../../../../Assets/Images/logo.png";
import "./mainpage.css";

const MainPage = () => {
  return (
    <section className="stories_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </nav>
      </header>
      <div className="stories_div">
        <p className="interests stories_title">
          Some people are writers, some are readers. And some are both.
          <br /> On this platform, you will be accommodated just as you are. You
          may choose to read stories from the community or share your own
          stories. Even better, you can do both. <br /> Click either of the
          buttons below to get started.
        </p>
        <div className="stories_btns">
          <button>
            <NavLink to="/read" className="stories_btn">
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
