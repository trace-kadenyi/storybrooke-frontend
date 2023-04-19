import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "../../../../Api/axios";

import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import { btnOptions } from "../../../AppData/data";
import "./share.css";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

const ShareStories = () => {
  const [genres, setGenres] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [author, setAuthor] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [response, setResponse] = useState("");

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

  // toggle genre div when the button is clicked
  const handleBtnClick = (e) => {
    e.preventDefault();
    const genreDiv = document.querySelector(".genre_checkboxes");
    genreDiv.classList.toggle("visible");
  };

  // handle genre selection
  const handleClick = (e) => {
    e.preventDefault();
    e.target.classList.toggle("selected");
    if (genres.includes(e.target.innerText)) {
      const index = genres.indexOf(e.target.innerText);
      genres.splice(index, 1);
    } else {
      genres.push(e.target.innerText);
    }
    console.log(genres);
  };

  // handle author radio input
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };

  // handle create story
  const handleSubmit = async (e) => {
    e.preventDefault();

    const storyData = {
      title: title,
      body: story,
      author: author,
      genres: genres,
    };
    console.log(storyData);
    try {
      const response = await axiosPrivate.post("/story", storyData);
      console.log(response.data);
      setResponse("Story published successfully");
      setTitle("");
      setStory("");
      setAuthor(JSON.parse(localStorage.getItem("user")));
      setGenres([]);
      // remove selected class from genre buttons
      const genreBtns = document.querySelectorAll(".genre_btn");
      if(genreBtns.classList.contains("selected")){
        genreBtns.classList.remove("selected");
      }
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 401) {
        setResponse("Unauthorized");
      } else if (error.response.status === 400) {
        setResponse(
          "The story you're trying to add already exists in at least one genre in the database. Please come up with a new story. If you want to add this story to another genre, please use the update story route."
        );
      } else {
        setResponse("Something went wrong");
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
        <form className="share_stories_form" onSubmit={handleSubmit}>
          {/* title input */}
          <div className="story_title">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter your story title here"
              required
              value={title}
              onChange={(e) => setTitle(capitalize(e.target.value))}
            />
          </div>

          {/* radio input */}
          <div className="genre_radio">
            <p>
              <strong>
                Publish your story as <em>yourself</em> or as an{" "}
                <em>anonymous author</em>?
              </strong>
            </p>
            <input
              type="radio"
              name="owner"
              id="owner"
              value={JSON.parse(localStorage.getItem("user"))}
              checked={author === JSON.parse(localStorage.getItem("user"))}
              onChange={handleAuthor}
            />
            <label htmlFor="owner">
              {JSON.parse(localStorage.getItem("user"))}
            </label>
            <input
              type="radio"
              name="anonymous"
              id="anonymous"
              value="Anonymous"
              checked={author === "Anonymous"}
              onChange={handleAuthor}
            />
            <label htmlFor="anonymous">Anonymous</label>
          </div>
          {/* <select name="genre" id="genre">
            <option value="romance">Romance</option>
            <option value="horror">Horror</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="action">Action</option>
          </select> */}
          <div className="genre_popup">
            <p>
              <strong>Choose a maximum of 3 genre(s) for your story</strong>
            </p>
            <button className="genre_selection_btn" onClick={handleBtnClick}>
              Click to select genres
            </button>
            <div className="genre_checkboxes visible">
              <div className="genre_btns">
                {btnOptions.sort().map((btn, index) => {
                  return (
                    <button
                      key={index}
                      className="genre_btn"
                      onClick={handleClick}
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <label htmlFor="story">Story</label>
          <textarea
            type="text"
            name="story"
            id="story"
            rows="20"
            className="story_textarea"
            placeholder="Tell me a story..."
            required
            value={story}
            onChange={(e) => setStory(capitalize(e.target.value))}
            // trigger the capitalize function on every keypress
            onKeyPress={(e) => {
              e.target.value = capitalize(e.target.value);
            }}
          ></textarea>

          <div>
            <button type="submit" className="share_btn">
              Publish
            </button>
          </div>
        </form>
        <p>
          <strong>{response}</strong>
        </p>
      </div>
    </section>
  );
};

export default ShareStories;
