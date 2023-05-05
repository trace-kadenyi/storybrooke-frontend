import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import MainNavbar from "../../../Navigation/MainNavbar";
import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import { btnOptions } from "../../../AppData/data";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";

const ReadStories = () => {
  const navigate = useNavigate();

  return (
    <section className="read_stories_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </nav>
      </header>
      <div>
        <>
          <p className="read_stories_intro">
            Read some of the stories written by the users of this platform. You
            can filter the stories by the genre of your choice, your favourite
            author or the title of the story. You can also explore all the
            stories by clicking on the "Explore" button. In an effort to
            customize your account, we have created a page dedicated to stories
            within the genres/interests you have selected. Click on the "My
            stories" button to view the stories that are relevant to you.
          </p>
        </>
        <div className="read_stories_btns">
          <button
            className="read_stories_btn"
            onClick={() => navigate("/explore")}
          >
            Explore
          </button>
          <button
            className="read_stories_btn"
            onClick={() => navigate("/my_stories")}
          >
            My stories
          </button>
          <button
            className="read_stories_btn"
            onClick={() => navigate("/by_genre")}
          >
            By genre
          </button>
          <button
            className="read_stories_btn"
            onClick={() => navigate("/by_author")}
          >
            By author
          </button>
          <button
            className="read_stories_btn"
            onClick={() => navigate("/by_title")}
          >
            By title
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReadStories;
