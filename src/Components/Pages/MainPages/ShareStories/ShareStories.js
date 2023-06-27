import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import MainNavbar from "../../../Navigation/MainNavbar";
import logo from "../../../../Assets/Images/logo.png";
import { btnOptions } from "../../../AppData/data";
import "./share.css";
import preloader from "../../../../Assets/Images/submit.gif";
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
  const [titleResponse, setTitleResponse] = useState("");
  const [storyResponse, setStoryResponse] = useState("");
  const [genreResponse, setGenreResponse] = useState("");
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked

  // manage error responses
  useEffect(() => {
    setResponse("");
    setTitleResponse("");
    setStoryResponse("");
    setGenreResponse("");
  }, [title, story, genres]);

  // capitalize sentences and acknowledge paragraphs
  const capitalize = (str) => {
    if (str.length === 0) {
      return str;
    } else if (str.length >= 1) {
      // if there has been no punctuation, capitalize the first letter of the first word of the story
      if (!str.includes(".") && !str.includes("?") && !str.includes("!")) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      } else {
        // capitalize the first letter of each sentence and acknowledge paragraphs
        return str.replace(/(.+?)([.?!]\s|$)/g, (match, p1, p2) => {
          return p1.charAt(0).toUpperCase() + p1.slice(1) + p2;
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
      setGenres(genres);
    }

    // if genre length is greater than 0
    if (genres.length > 0) {
      setGenreResponse("");
    }
    // if genre length is greater than 3, disable the rest of the buttons
    if (genres.length >= 3) {
      const genreBtns = document.querySelectorAll(".genre_btn");
      genreBtns.forEach((btn) => {
        if (!btn.classList.contains("selected")) {
          btn.disabled = true;
        }
      });
    } else {
      const genreBtns = document.querySelectorAll(".genre_btn");
      genreBtns.forEach((btn) => {
        btn.disabled = false;
      });
    }
  };

  // handle author radio input
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };

  // toast message
  const showToastMessage = (response) => {
    toast.success(response, {
      position: toast.POSITION.TOP_RIGHT,
      className: "toast-message",
    });
  };

  // reset genres after story is submitted
  const resetGenres = () => {
    setGenres([]);
    const genreBtns = document.querySelectorAll(".genre_btn");
    genreBtns.forEach((btn) => {
      btn.classList.remove("selected");
      // enable all buttons
      btn.disabled = false;
    });
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
    if (title.length < 2) {
      setTitleResponse("Your title is too short. Please try again");
      // shift focus to title input
      document.querySelector(".title_input").focus();
      return;
    } else if (genres.length === 0) {
      setGenreResponse("Please select at least one genre");
      // shift focus to genre button
      document.querySelector(".genre_selection_btn").focus();
      return;
    } else if (story.length < 50) {
      setStoryResponse("Your story is too short. Please try again");
      // shift focus to story textarea
      document.querySelector(".story_textarea").focus();
      return;
    }
    setLoadSubmit(true);
    try {
      const response = await axiosPrivate.post("/story", storyData);
      setTitle("");
      setStory("");
      setAuthor(JSON.parse(localStorage.getItem("user")));

      // reset genres
      resetGenres();

      // shift focus to top of page
      window.scrollTo(0, 0);

      // show toast message
      showToastMessage(response.data.message);
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 401) {
        setResponse("Unauthorized");
        alert("Unauthorized. Please log in again.");
        // redirect to login page in 3 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (error.response.status === 400) {
        setResponse(error.response.data.message);
        // alert(error.response.data.message);
      } else {
        setResponse("Something went wrong. Please try again");
      }
    }
    setLoadSubmit(false);
  };

  return (
    <section className="share_stories_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </nav>
      </header>
      <h2 className="share_title">
        Share your story with us and we will share it with the world
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
          <div className="story_title_div">
            <p className="response">{titleResponse}</p>
            <label htmlFor="title" className="hide_label">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title_input"
            />
          </div>

          {/* radio input for author */}
          <div className="author_radio">
            <p className="select_author">
              <strong>
                Publish your story as{" "}
                <span className="publish_opt">Yourself</span> or as an{" "}
                <span className="publish_opt"> Anonymous</span> author?
              </strong>
            </p>
            <div className="radio_inputs">
              <div className="individual_author_input">
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
              </div>
              <div className="individual_author_input">
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
            </div>
          </div>

          {/* genre input */}
          <div className="genre_popup">
            <p className="select_genres">
              <strong>Choose a maximum of 3 genre(s) for your story</strong>
            </p>
            <p className="response">
              <strong>{genreResponse}</strong>
            </p>
            <button className="genre_selection_btn" onClick={handleBtnClick}>
              Toggle Genre Selection
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

          <p className="response">
            <strong>{storyResponse}</strong>
          </p>

          {/* story text input */}
          <div className="story_textarea_div">
            <label htmlFor="story" className="hide_label">
              Story
            </label>
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
            ></textarea>
          </div>
          {/* response message */}
          <p className="publish_response">
            <strong>{response}</strong>
          </p>
          {/* <div>
            <button type="submit" className="share_btn">
              Publish
            </button>
          </div> */}

          <div className="story_submit_div">
            <button type="submit" className="share_btn">
              <span>Publish</span>
              {/* preloader span */}
              {loadSubmit && (
                <span className="preloader_span">
                  <img src={preloader} alt="preloader" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ShareStories;
