import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { TiTick } from "react-icons/ti";

import MainNavbar from "../../../Navigation/MainNavbar";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";
import preloader from "../../../../Assets/Images/main.gif";

const IndividualStory = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked

  // current user
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // get story id from url
  const id = window.location.pathname.split("/")[2];
  // fetch story from db
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axiosPrivate.get(`/story/${id}`);
        setTitle(response.data.title);
        // setStory(response.data.story.story);
        setAuthor(response.data.author);
        setGenres(response.data.genres);
        setDate(response.data.date);
        setBody(response.data.body);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };
    fetchStory();
    // eslint-disable-next-line
  }, []);

  // handle edit story
  const handleEditStory = (e) => {
    const storyId = e.currentTarget.id;
    navigate(`/update_story/${storyId}`);
  };

  // handle delete story
  const handleDeleteStory = async (e) => {
    const storyId = e.currentTarget.id;
    try {
      setLoadSubmit(true);
      const response = await axiosPrivate.delete(`/story/${storyId}`);
      toast.success(response.data.message);
      navigate("/explore");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setLoadSubmit(false);
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
        {!loading && (
          <div key={id} className="individual_story">
            {/* delete story */}
            {author === currentUser && (
              <div className="delete_story_div">
                <button
                  className="delete_story_btn"
                  id={id}
                  onClick={handleDeleteStory}
                >
                  <span>Delete Story</span>
                  {/* preloader span */}
                  {loadSubmit && (
                    <span className="story_preloader_span">
                      <TiTick className="story_tick_icon" />
                    </span>
                  )}
                </button>
              </div>
            )}
            <div className="title_date">
              <div className="title_author">
                <div id={id}>
                  <span className="story_title">{title} </span>
                  <span className="by">by </span>
                  <span className="story_author">{author}</span>
                </div>
                {/* edit story */}
                {author === currentUser && (
                  <div>
                    <AiFillEdit
                      className="story_edit_icon"
                      id={id}
                      onClick={handleEditStory}
                    />
                  </div>
                )}
              </div>
              <span className="story_date">Created: {date.slice(0, 10)}</span>
            </div>
            <ul className="story_genres">
              {genres.map((genre) => {
                return (
                  <li key={genre} className="story_genre">
                    {genre} |
                  </li>
                );
              })}
            </ul>
            {/* <p className="story_body">{body}</p> */}
            {body.map((paragraph, index) => (
              <p key={index} className="story_body">
                {paragraph}
              </p>
            ))}

            <h6 className="the_end">THE END</h6>
          </div>
        )}
      </div>
    </section>
  );
};

export default IndividualStory;
