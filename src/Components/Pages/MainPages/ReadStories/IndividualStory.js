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
  const [comments, setComments] = useState([]);
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
  const handleDeleteStory = () => {
    // hide the main div behind a black background
    const mainDiv = document.querySelector(".individual_str_sect");
    mainDiv.style.opacity = "0.2";
    mainDiv.style.pointerEvents = "none";

    // Create a custom component for the toast content
    const DeleteStoryConfirmation = () => (
      <div className="del_acc_div">
        <p>
          Are you sure you want to delete your story permanently? This action
          cannot be undone.
        </p>
        <div className="delete_acc_toast_div">
          <button onClick={confirmDeleteStory} className="yes" id={id}>
            Yes
          </button>
          <button onClick={cancelDeleteStory} className="no">
            No
          </button>
        </div>
      </div>
    );

    // Display the confirmation toast
    toast.info(<DeleteStoryConfirmation />, {
      position: toast.POSITION.TOP_RIGHT,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-toast-progress",
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      hideProgressBar: true,
    });
  };

  // Function to confirm deleting the account
  const confirmDeleteStory = async (e) => {
    const storyId = e.currentTarget.id;
    // dismiss toast
    toast.dismiss();
    // Return the main page to normal
    const mainDiv = document.querySelector(".individual_str_sect");
    mainDiv.style.opacity = "1";
    mainDiv.style.pointerEvents = "auto";
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

  // Function to cancel deleting the account
  const cancelDeleteStory = () => {
    toast.dismiss();

    const mainDiv = document.querySelector(".individual_str_sect");
    mainDiv.style.opacity = "1";
    mainDiv.style.pointerEvents = "auto";
  };

  // handle fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosPrivate.get(`/comments/${id}`);
        setComments(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, []);

  return (
    <section className="explore_sect individual_str_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </nav>
      </header>
      {/* story */}
      <div className="all_stories individual_all_stories">
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
          <div key={id} className="individual_story individual_story_page">
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
            {body.map((paragraph, index) => (
              <p key={index} className="story_body">
                {paragraph}
              </p>
            ))}

            <h6 className="the_end">THE END</h6>
          </div>
        )}
      </div>
      {/* comments section */}
      <div className="comments_div">
        <h3 className="comments_header">COMMENTS</h3>
        <div className="comments">
          {comments.length > 0 ? (
            <ul className="comments_list">
              {comments.map((comment) => (
                <li key={comment._id} className="comment">
                  <div className="comment_author_date">
                    <p className="comment_author">{comment.commenter}</p>
                    <p className="comment_date">
                      <span>{comment.date} </span>{" "}
                    </p>
                  </div>
                  <div className="comment_body_div">
                    <p className="comment_body">{comment.body}</p>
                    <span className="am_pm">{comment.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no_comments">No comments yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default IndividualStory;
