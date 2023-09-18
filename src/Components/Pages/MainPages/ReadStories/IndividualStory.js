import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";

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
  const [replyData, setReplyData] = useState({});
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");
  const [comment, setComment] = useState("");
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
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [comments.length]);

  // handle fetch replies
  const handleFetchReplies = async (e) => {
    const commentID = e.currentTarget.id;
    try {
      const response = await axiosPrivate.get(`/comments/replies/${commentID}`);
      setReplyData({
        ...replyData,
        [commentID]: response.data,
      });

      if (!response.data.length) {
        const reply = document.querySelector(
          `.replies_list[id="${commentID}"]`
        );
        reply.innerHTML = "<p class='no_replies'>No replies yet</p>";
      }
    } catch (error) {
      console.log(error);
    }
    const repliesBtn = document.querySelector(
      `.comment_reply_btn[id="${commentID}"]`
    );
    repliesBtn.style.visibility = "hidden";
  };

  // handle replies date
  const handleRepliesDate = (date) => {
    const today = new Date();

    const dateString = date;
    const dateFromLocalString = new Date(dateString);

    const timeDiff = today - dateFromLocalString;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else if (days >= 30 && days < 365) {
      const months = Math.floor(days / 30);
      return `${months} months ago`;
    } else if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} years ago`;
    } else {
      return "Just now";
    }
  };

  // handle add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = {
        commenter: currentUser,
        body: comment,
      };
      const response = await axiosPrivate.post(`/comments/${id}`, newComment);
      setComments([...comments, response.data.comment]);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  // handle add comment button
  const addCommentBtn = document.querySelector(".add_comment_btn");
  if (addCommentBtn) {
    if (comment.length < 1) {
      addCommentBtn.style.opacity = "0.5";
      // addCommentBtn.style.pointerEvents = "none";
      addCommentBtn.style.padding = "3px";
      addCommentBtn.style.cursor = "not-allowed";
    } else {
      addCommentBtn.style.opacity = "1";
      addCommentBtn.style.pointerEvents = "auto";
      addCommentBtn.style.backgroundColor = "#548341";
      addCommentBtn.style.color = "#fff";
      addCommentBtn.style.cursor = "pointer";
    }
  }

  // toggle ellipsis and edit/delete buttons
  const toggleEllipsis = (e) => {
    const ellipsis = e.currentTarget;
    const editDeleteBtn =
      e.currentTarget.parentElement.parentElement.nextElementSibling;
    // if (ellipsis.style.display === "none") {
    //   ellipsis.style.display = "flex";
    //   editDeleteBtn.style.display = "none";
    // } else {
    //   ellipsis.style.display = "none";
    //   editDeleteBtn.style.display = "flex";
    // }
    editDeleteBtn.classList.toggle("edit_delete_btn_toggle");
  };

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
      {!loading && (
        <div className="comments_div">
          <h3 className="comments_header">COMMENTS</h3>
          {/* add a comment */}
          <div className="add_comment_div">
            <form className="add_comment_form" onSubmit={handleAddComment}>
              <textarea
                className="add_comment_textarea"
                placeholder="What do you think?"
                value={comment}
                required
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button className="add_comment_btn">Add Comment</button>
            </form>
          </div>
          {/* display all comments */}
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
                      {/* <span className="am_pm">{comment.time}</span> */}
                    </div>
                    <div className="comment_reply_div">
                      <div className="reply_ampm_div">
                        <button
                          className="comment_reply_btn"
                          id={comment._id}
                          onClick={handleFetchReplies}
                        >
                          View replies
                        </button>
                        <span className="am_pm">
                          {comment.time}
                          <IoEllipsisHorizontalCircle
                            className="ellipsis"
                            onClick={toggleEllipsis}
                          />
                        </span>
                      </div>
                      <div className="comment_edit_delete_btn">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                      {/* replies */}
                      <ul className="replies_list" id={comment._id}>
                        {
                          // check if the replies exist
                          (replyData[comment._id] || []).map((reply) => (
                            <li
                              key={reply._id}
                              className="reply"
                              id={comment._id}
                            >
                              <div className="reply_author_date">
                                <p className="reply_author">
                                  {reply.commenter}
                                </p>
                                <p className="comment_date">
                                  {/* {reply.date} */}
                                  {handleRepliesDate(reply.date)}
                                </p>
                              </div>
                              <div className="reply_body_div">
                                <p className="reply_body">{reply.body}</p>
                              </div>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no_comments">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default IndividualStory;
