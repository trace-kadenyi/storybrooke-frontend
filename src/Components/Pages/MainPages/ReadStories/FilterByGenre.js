import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { btnOptions } from "../../../AppData/data";
import "./read.css";

const FilterByGenre = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState(false); // for when there are no stories to display
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);
  const axiosPrivate = useAxiosPrivate();

  const controller = new AbortController();

  const handleFetchStories = async (genre) => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/story/${genre}`, {
        signal: controller.signal,
      });
      console.log(response.data);
      setStories(response.data);
      // handle no stories to display
      if (stories.length === 0) {
        setResponse(`No stories found in this genre. Please select another.`);
      }
      // timeout loading and set message if no stories are found
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
        // alert(error.response.data.message);
      } else {
        setResponse("Something went wrong. Please try again");
      }
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const genre = e.target.innerText;
    console.log(genre);
    handleFetchStories(genre);
  };

  return (
    <section className="explore_sect filter_by_genre_sect">
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
      <div className="home_main_div">
        <>
          <p className="interests">
            Select the genre of your choice to view stories within that genre.
          </p>
        </>

        {/* display interests */}
        <div className="home_main_div_btns">
          {btnOptions.sort().map((btn, index) => {
            return (
              <button
                key={index}
                className="home_main_div_btns_btn"
                onClick={handleClick}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>

      {/* display stories */}
      <div>
        <>
          <div className="all_stories">
            {loading && <p className="loading">Loading...</p>}
            {/* {error && <p className="error">No stories to display</p>} */}
            {/* {missing && <p className="missing">No stories to display</p>} */}

            {stories.length > 0 ? (
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
              <p className="response">{response}</p>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default FilterByGenre;
