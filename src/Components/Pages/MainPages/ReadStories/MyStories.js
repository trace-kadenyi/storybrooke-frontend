import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const effectRun = useRef(false);
  const axiosPrivate = useAxiosPrivate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // fetch interests from user
  useEffect(() => {
    const getInterests = async () => {
      try {
        const response = await axiosPrivate.get(`/users`);
        // return the interests of the logged in user
        const userInterests = response.data.find(
          (user) => user.username === currentUser
        ).interests;
        // set the interests in the state in alphabetical order
        setInterests(
          userInterests.sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
          )
        );
        console.log(interests);
      } catch (err) {
        console.log(err);
        setError(error);
      }
    };
    getInterests();
    //eslint-disable-next-line
  }, []);

  // get stories based on interests/genres
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // get the stories from each genre in the interests array
    const getStoriesFromInterests = async () => {
      setLoading(true);
      try {
        const storiesFromInterests = await Promise.all(
          interests.map(async (interest) => {
            const response = await axiosPrivate.get(`/story/${interest}`, {
              signal: controller.signal,
            });
            return response.data;
          })
        );

        // remove responses with no stories
        const filteredStories = storiesFromInterests.filter(
          (story) => story.length > 0
        );
        filteredStories.flat();
        isMounted && setStories(filteredStories.flat());
        if (stories.length === 0) {
          setLoading(true);
          setTimeout(() => {
            setResponse("No stories found");
          }, 2000);
        } else if (stories.length > 0) {
          setResponse("");
        }

        setLoading(false);
        return filteredStories;
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (effectRun.current) {
      getStoriesFromInterests();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [interests.length]);

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
      <>
        <div className="all_stories">
          <p className="explore_intro">My Stories</p>
          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error.message}</p>}
          {stories.map((story) => {
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
          })}
        </div>
        <div className="by_genre_response">
          {stories.length === 0 && response === "No stories found" ? (
            <p className="no_stories">No stories found</p>
          ) : (
            ""
          )}
        </div>
      </>
    </section>
  );
};

export default MyStories;
