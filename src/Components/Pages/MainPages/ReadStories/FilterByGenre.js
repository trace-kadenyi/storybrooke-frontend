import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

import MainNavbar from "../../../Navigation/MainNavbar";
import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { btnOptions } from "../../../AppData/data";
import "./read.css";

const FilterByGenre = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const controller = new AbortController();

  const handleFetchStories = async (genre) => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/story/${genre}`, {
        signal: controller.signal,
      });
      setStories(response.data);
      // handle no stories to display
      if (stories.length === 0) {
        setResponse(
          <p>
            <span>No stories yet in this genre. Follow </span>
            <span>
              <Link to="/share" className="write_link">
                this link
              </Link>
            </span>
            <span> and be the first to share a story in this genre</span>
          </p>
        );
      }
      setLoading(false);
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
      } else if (error.response.status === 404) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Something went wrong. Please try again");
      }
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  };

  const handleClick = (e) => {
    e.preventDefault();
    const genre = e.target.innerText;
    handleFetchStories(genre);

    e.target.classList.toggle("selected");
    if (selectedGenre.includes(e.target.innerText)) {
      const index = selectedGenre.indexOf(e.target.innerText);
      selectedGenre.splice(index, 1);
      setLoading(false);
    } else {
      selectedGenre.push(e.target.innerText);
      setSelectedGenre(selectedGenre);
      const genreDiv = document.querySelector(".genre_checkboxes");
      genreDiv.classList.add("visible");
    }

    // user cannot select more than one genre
    const genreBtns = document.querySelectorAll(".selected_genre_btn");
    const allStories = document.querySelector(".all_stories");

    if (selectedGenre.length === 1) {
      genreBtns.forEach((btn) => {
        if (!btn.classList.contains("selected")) {
          btn.disabled = true;
        }
        allStories.style.display = "flex";
      });
    } else if (selectedGenre.length === 0) {
      genreBtns.forEach((btn) => {
        btn.disabled = false;
        // remove the stories on display
        allStories.style.display = "none";
      });
    }
  };

  // toggle genre div when the button is clicked
  const handleBtnClick = (e) => {
    e.preventDefault();
    const genreDiv = document.querySelector(".genre_checkboxes");
    genreDiv.classList.toggle("visible");
  };

  return (
    <section className="explore_sect filter_by_genre_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </nav>
      </header>
      <div className="home_main_div">
        <>
          <p className="filter_title">
            Select the genre of your choice to view stories within that genre
          </p>
        </>

        {/* toggle genre div when the button is clicked */}
        <div className="genre_popup">
          <button className="genre_selection_btn" onClick={handleBtnClick}>
            Toggle Genre Selection
          </button>
        </div>

        {/* display interests */}
        <div className="genre_checkboxes">
          <div className="selected_genre_div_btns">
            {btnOptions.sort().map((btn, index) => {
              return (
                <button
                  key={index}
                  className="selected_genre_btn"
                  onClick={handleClick}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* display stories */}
      <div>
        <>
          <div className="all_stories">
            {loading ? (
              <p className="load_stories">Loading...</p>
            ) : stories.length > 0 ? (
              stories.map((story) => {
                return (
                  <div key={story._id} className="individual_story">
                    <div className="title_date">
                      <p className="title_author">
                        <span className="story_title">{story.title} </span>
                        <span className="by">by </span>
                        <span className="story_author">{story.author}</span>
                      </p>
                      <span className="story_date">{story.date}</span>
                    </div>
                    <ul className="story_genres">
                      {story.genres.map((genre) => {
                        return (
                          <li key={genre} className="story_genre">
                            {genre} |
                          </li>
                        );
                      })}
                    </ul>
                    <p className="story_body">{story.body}</p>
                  </div>
                );
              })
            ) : (
              <div className="by_genre_response">{response}</div>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default FilterByGenre;
