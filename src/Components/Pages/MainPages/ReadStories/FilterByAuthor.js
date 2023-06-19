import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainNavbar from "../../../Navigation/MainNavbar";
import Blueprint from "./Blueprint";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";
import preloader from "../../../../Assets/Images/main.gif";

const FilterByAuthor = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [response, setResponse] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const controller = new AbortController();

  // handle fetch stories
  const handleFetchStories = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/story/author/${author}`, {
        signal: controller.signal,
      });
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

    return () => {
      controller.abort();
    };
  };

  // handle filter by author
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetchStories();
    setStories([]);
  };

  return (
    <section className="explore_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
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
              <div className="main_preloader">
                <img
                  src={preloader}
                  alt="preloader"
                  className="main_preloader_img"
                />
              </div>
            ) : stories.length > 0 ? (
              stories.map((story) => {
                return <Blueprint key={story._id} story={story} />;
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
