import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import { btnOptions } from "../../../AppData/data";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";

const ReadStories = () => {
  return (
    <section className='read_stories_sect'>
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
              <NavLink to="/main" className="link">
                Main
              </NavLink>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </nav>
      </header>
      <div>
        <h1>Read Stories</h1>
        <p>
          Read some of the stories written by the users of this platform. 
        </p>
      </div>
    </section>
  )
}

export default ReadStories