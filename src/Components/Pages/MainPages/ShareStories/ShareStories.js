import React, { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import "./share.css";

const ShareStories = () => {
  //    capitalize sentences
  const capitalize = (str) => {
    if (str.length === 0) {
      return str;
    } else if (str.length >= 1) {
      // if there has been no punctuation, capitalize the first letter of the first word of the story
      if (!str.includes(".") && !str.includes("?") && !str.includes("!")) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      } else {
        // capitalize the first letter of the first word after a punctuation
        return str.replace(/([.?!])\s*(\w)/g, (match, p1, p2) => {
          return p1 + " " + p2.toUpperCase();
        });
      }
    }
  };

  return (
    <section className="share_stories_sect">
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
      <h2 className="share_title">
        Share your story with us and we will share it with the world.
      </h2>
      <div className="intro_sect">
        <h4>Just a few exceptions to consider...</h4>
        <ul>
          <li>
            We check the stories for plagiarism. Therefore, if your story bears
            a strong resemblance to another story, we will not publish it.
          </li>
          <li>
            While adding your stories to different genres, please ensure that
            your story is relevant to that genre.
          </li>
          <li>
            Try to vary the titles of your stories, particularly when adding
            them to the same genre. This will help us to avoid confusion for the
            readers.
          </li>
        </ul>
      </div>
      <div className="share_stories_div">
        <form className="share_stories_form">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" />
          <label htmlFor="genre">Genre</label>
          <select name="genre" id="genre">
            <option value="romance">Romance</option>
            <option value="horror">Horror</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="action">Action</option>
          </select>
          <label htmlFor="story">Story</label>
          <textarea
            type="text"
            name="story"
            id="story"
            rows="20"
            className="story_textarea"
            required
            placeholder="Tell me a story..."
            // trigger the capitalize function on every keypress
            onKeyPress={(e) => {
              e.target.value = capitalize(e.target.value);
            }}
          ></textarea>
        </form>
      </div>
    </section>
  );
};

export default ShareStories;
