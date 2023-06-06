import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";

import MainNavbar from "../../../Navigation/MainNavbar";
import Logout from "../../../Logout";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";
import preloader from "../../../../Assets/Images/main.gif";

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // handle fetch stories
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const effectRun = useRef(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/story", {
          signal: controller.signal,
        });
        console.log(response.data.stories);
        isMounted && setStories(response.data.stories);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log(error);
        // navigate("/login", { state: { from: location }, replace: true });
        setLoading(false);
      }
    };
    if (effectRun.current) {
      fetchStories();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
    // eslint-disable-next-line
  }, []);


  // handle edit story
  const handleEditStory = (e) => {
    const storyId = e.currentTarget.id;
    console.log(storyId)
    navigate(`/update_story/${storyId}`);
  }

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
      <div>
        <>
          <p className="explore_intro">Explore</p>
          <div className="all_stories">
            {loading && (
              <div className="main_preloader">
                <img
                  src={preloader}
                  alt="preloader"
                  className="main_preloader_img"
                />
              </div>
            )}
            {error && <p className="error">{error.message}</p>}
            {stories.map((story) => {
              return (
                <div key={story._id} className="individual_story">
                  <div className="title_date">
                    <div className="title_author">
                      <div>
                        <span className="story_title">{story.title} </span>
                        <span className="by">by </span>
                        <span className="story_author">{story.author}</span>
                      </div>
                      <div>
                        <AiFillEdit
                          className="story_edit_icon"
                          id={story._id}
                          onClick={handleEditStory}
                        />
                      </div>
                    </div>
                    <span className="story_date">{story.date}</span>
                  </div>
                  {/* <div className="story_edit_div">
                    <AiFillEdit className="story" />
                  </div> */}
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
        </>
      </div>
    </section>
  );
};

export default Explore;
