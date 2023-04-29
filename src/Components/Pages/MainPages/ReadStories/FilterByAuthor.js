import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { btnOptions } from "../../../AppData/data";
import "./read.css";

const FilterByAuthor = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const controller = new AbortController();

  // capitalize first letter of author name
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // handle fetch stories
  const handleFetchStories = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/story/author/${author}`, {
        signal: controller.signal,
      });
      console.log(response.data);
      setStories(response.data);
      setAuthor("");
      // handle no stories to display
      if (stories.length === 0) {
        setResponse(<p>{"No stories published by this author"}</p>);
      }
      setLoading(false);
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 403) {
        setResponse("Unauthorized");
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
  };

  // handle filter by author
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(author);
    handleFetchStories();
    setStories([]);
    console.log(stories);
  };

  return (
    <section className="explore_sect">
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
      <div className="title_filter_div">
        <p className="filter_title">
          Enter the name of the author you're searching for in the search bar
          below
        </p>
        <div className="title_filter_form_div">
          <form className="title_filter_form" onSubmit={handleSubmit}>
            <div className="title_filter_input">
              <input
                type="text"
                placeholder="Search by author"
                className="search_input"
                autoFocus
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="title_filter_submit">
              <button type="submit" className="search_btn">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* display found stories by the author */}
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

export default FilterByAuthor;
