import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEdit, AiFillLike, AiFillDislike } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { BsFillReplyAllFill } from "react-icons/bs";
import { formatDistanceToNow, parse, parseISO, isValid } from "date-fns";

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
  const [reply, setReply] = useState(""); // to handle the reply input
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked
  const [edited, setEdited] = useState([]); // to show edited on comments that have been edited
  const [viewReplies, setViewReplies] = useState(false); // to show the view replies button
  const [timeAgo, setTimeAgo] = useState("");

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
        const fetchedComments = Array.isArray(response.data)
          ? response.data
          : [];

        setComments(fetchedComments);

        const editedCommentIds = fetchedComments
          .filter((comment) => comment.edited)
          .map((comment) => comment._id);

        setEdited(editedCommentIds);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [id, comments.length]);

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
    editDeleteBtn.classList.toggle("edit_delete_btn_toggle");
  };

  // delete comment
  const deleteComment = async (e) => {
    const commentID = e.currentTarget.id;
    try {
      await axiosPrivate.delete(`/comments/${commentID}`);
      const newComments = comments.filter((comment) => {
        return comment._id !== commentID;
      });
      setComments(newComments);
    } catch (error) {
      console.log(error);
    }
  };

  // edit comment
  const editComment = async (e, owner) => {
    const commentID = e.currentTarget.id;
    const commentBody = document.querySelector(
      `.comment_body[id="${commentID}"]`
    );
    const editDeleteBtn = document.querySelector(
      `.comment_edit_delete_btn[id="${commentID}"]`
    );

    //  turn the comment body into a textarea
    const textarea = document.createElement("textarea");
    textarea.className = "edit_comment_textarea";
    textarea.value = commentBody.textContent;
    textarea.rows = "3";
    commentBody.replaceWith(textarea);
    textarea.focus();
    const btnsDiv = document.createElement("div");
    btnsDiv.className = "submit-cancel-btns-div";
    textarea.after(btnsDiv);
    const goBtn = document.createElement("button");
    goBtn.className = "go_btn";
    goBtn.textContent = "Submit";
    btnsDiv.append(goBtn);
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel_btn";
    cancelBtn.textContent = "Cancel";
    btnsDiv.append(cancelBtn);

    // cancel edit
    cancelBtn.addEventListener("click", () => {
      textarea.replaceWith(commentBody);
      goBtn.remove();
      cancelBtn.remove();
      editDeleteBtn.classList.remove("edit_delete_btn_toggle");
    });

    // edit comment
    try {
      goBtn.addEventListener("click", async (e) => {
        const newCommentBody = document.createElement("p");
        newCommentBody.className = "comment_body";
        newCommentBody.id = commentID;
        newCommentBody.textContent = textarea.value;
        textarea.replaceWith(newCommentBody);
        goBtn.remove();
        cancelBtn.remove();

        // edit comment
        const updatedComment = {
          commenter: owner,
          body: textarea.value,
        };
        await axiosPrivate.put(`/comments/edit/${commentID}`, updatedComment);

        let dateObj = new Date();
        let options = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };

        const date = dateObj.toLocaleDateString(undefined, options);

        // hide the edit/delete buttons

        editDeleteBtn.classList.remove("edit_delete_btn_toggle");

        const newComments = comments.map((comment) => {
          if (comment._id === commentID) {
            return {
              ...comment,
              body: textarea.value,
              date: date,
              time: new Date().toLocaleTimeString(),
            };
          }
          return comment;
        });
        setComments(newComments);

        setEdited((prevEdited) => [...prevEdited, commentID]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handle reply button
  const handleReplyBtn = (e) => {
    const replyBtn = e.currentTarget;
    const replyDiv = replyBtn.parentElement.parentElement.nextElementSibling;
    replyDiv.style.display = "flex";
  };

  // handle cancel reply button
  const cancelReply = (e) => {
    const cancelBtn = e.currentTarget;
    const replyDiv = cancelBtn.parentElement.parentElement;
    replyDiv.style.display = "none";
  };

  // handle fetch replies
  const handleFetchReplies = async (commentID) => {
    try {
      const response = await axiosPrivate.get(`/comments/replies/${commentID}`);
      const replies = response.data;

      // Update replyData state with the fetched replies
      setReplyData((prevReplyData) => ({
        ...prevReplyData,
        [commentID]: replies,
      }));

      // No need to toggle viewReplies state here

      const replyList = document.querySelector(
        `.replies_list[id="${commentID}"]`
      );

      if (replyList) {
        if (replies && replies.length > 0) {
          // Render replies
        } else {
          // Render "No replies yet" if there are no replies
          replyList.innerHTML = "No replies yet";
          replyList.classList.add("no_replies");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle view replies
  const handleViewReplies = (commentID) => {
    // Toggle viewReplies state for the specific comment
    setViewReplies((prevViewReplies) => ({
      ...prevViewReplies,
      [commentID]: !prevViewReplies[commentID],
    }));

    const replyList = document.querySelector(
      `.replies_list[id="${commentID}"]`
    );

    if (viewReplies[commentID]) {
      // Hide the replies
      replyList.style.display = "none";
      replyList.classList.remove("no_replies");
    } else {
      // Show the replies
      replyList.style.display = "block";
    }

    // If the replies have not been fetched yet, fetch them
    if (!replyData[commentID]) {
      handleFetchReplies(commentID);
    }

    // If the replies have been fetched, but the user clicks on the "View Replies" button again, hide the replies
    if (replyData[commentID] && viewReplies[commentID]) {
      replyList.style.display = "none";
    }

    // If the replies have been fetched, but the user clicks on the "Hide Replies" button again, show the replies
    if (replyData[commentID] && !viewReplies[commentID]) {
      replyList.style.display = "block";
      // add no replies class if there are no replies
      if (replyList.textContent === "No replies yet") {
        // replyList.innerHTML = "No replies yet";
        replyList.classList.add("no_replies");
      }
    }
  };

  // handle replies date
  // const handleRepliesDate = (commentDate, commentTime) => {
  //   // Construct a date string in the format: 'Dec 17, 2023 11:28:52'
  //   const commentDateTimeString = `${commentDate} ${commentTime}`;

  //   // Create a Date object for the comment date and time
  //   const commentDateTime = new Date(commentDateTimeString);

  //   // Get the current date and time
  //   const today = new Date();

  //   // Calculate the time difference in milliseconds
  //   const timeDiff = today - commentDateTime;

  //   // Convert the time difference to seconds, minutes, hours, etc.
  //   const seconds = Math.floor(timeDiff / 1000);
  //   const minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);
  //   const days = Math.floor(hours / 24);

  //   if (seconds <= 0) {
  //   } else if (seconds < 60) {
  //     return `${seconds} seconds ago`;
  //   } else if (minutes < 60) {
  //     return `${minutes} minutes ago`;
  //   } else if (hours < 24) {
  //     return `${hours} hours ago`;
  //   } else if (days < 30) {
  //     return `${days} days ago`;
  //   } else if (days >= 30 && days < 365) {
  //     const months = Math.floor(days / 30);
  //     return `${months} months ago`;
  //   } else if (days >= 365) {
  //     const years = Math.floor(days / 365);
  //     return `${years} years ago`;
  //   } else {
  //     // Format the comment date and time in the user's local time zone
  //     return commentDateTime.toLocaleString();
  //   }
  // };

  // handle comment date
  const handleCommentDate = (dateString) => {
    const dateObject = new Date(dateString);

    const formattedDate = dateObject
      .toDateString()
      .replace(/^\S+\s/, "") // Remove the day of the week
      .replace(/(\d{2})\s/, "$1, "); // Add a comma after the day

    return formattedDate;
  };

  // handle comment time
  const handleCommentTime = (fullDate) => {
    // console.log(fullDate)
    const localTime = new Date(fullDate).toLocaleTimeString();

    const time = localTime.replace(/:\d{2}\s/, " "); // Remove the seconds
    // console.log(time)

    if(time === "Invalid Date") {
      return fullDate.replace(/:\d{2}\s/, " "); // Remove the seconds
    } else {
      return time;
    }
  };

  // handle replies date
  const handleRepliesDate = (replyDate) => {
    try {
      // Remove the '(East Africa Time)' part from the string
      const dateWithoutTimeZone = replyDate.replace(/ \(.*\)/, "");

      // Create a Date object for the adjusted date
      const date = new Date(dateWithoutTimeZone);

      // Format the date difference
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error adjusting date:", error);
      return replyDate; // Return the original date string in case of an error
    }
  };

  // handle add reply
  const addReply = async (e) => {
    const commentID = e.currentTarget.id;

    try {
      const newReply = {
        commenter: currentUser,
        body: reply,
      };

      const response = await axiosPrivate.post(
        `/comments/reply/${commentID}`,
        newReply
      );

      setReplyData((prevReplyData) => {
        const existingReplies = Array.isArray(prevReplyData[commentID])
          ? prevReplyData[commentID]
          : [];

        return {
          ...prevReplyData,
          [commentID]: [...existingReplies, { ...response.data.reply }],
        };
      });

      // clear the reply input
      setReply("");

      // change view replies to true if it is false for that comment

      setViewReplies((prevViewReplies) => ({
        ...prevViewReplies,
        [commentID]: true,
      }));

      // show the replies
      const replyList = document.querySelector(
        `.replies_list[id="${commentID}"]`
      );

      replyList.style.display = "block";

      // hide the reply input
      const replyDiv = document.querySelector(
        `.reply_input_div[id="${commentID}"]`
      );
      replyDiv.style.display = "none";

      if (replyList.innerHTML === `No replies yet`) {
        replyList.innerHTML = "";
        replyList.classList.remove("no_replies");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete reply
  const deleteReply = async (e) => {
    const commentID = e.currentTarget.parentElement.parentElement.id;
    const replyID = e.currentTarget.id;

    try {
      const response = await axiosPrivate.delete(`/comments/reply/${replyID}`);

      const newReplies = replyData[commentID].filter((reply) => {
        return reply._id !== replyID;
      });

      setReplyData({
        ...replyData,
        [commentID]: newReplies,
      });

      setTimeout(() => {
        const replyList = document.querySelector(
          `.replies_list[id="${commentID}"]`
        );

        if (newReplies.length === 0 && replyList) {
          replyList.innerHTML = "No replies yet";
          replyList.classList.add("no_replies");
        }
      }, 0);
    } catch (error) {
      console.log(error);
    }
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
                rows={3}
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
                        <span>{handleCommentDate(comment.date)}</span>{" "}
                      </p>
                    </div>
                    {edited.includes(comment._id) && (
                      <span className="edited"> (edited)</span>
                    )}
                    <div className="comment_body_div">
                      <p className="comment_body" id={comment._id}>
                        {comment.body}
                      </p>
                      {/* </div> */}
                      <span className="am_pm" style={{ margin: "10px 0" }}>
                        {/* {comment.time} */}
                        {handleCommentTime(comment.time)}
                      </span>
                    </div>
                    <div className="comment_reply_div">
                      <div className="like_reply_btn">
                        <button>
                          <AiFillLike className="like_icon" />
                        </button>
                        <button>
                          <BsFillReplyAllFill
                            className="reply_icon"
                            onClick={handleReplyBtn}
                          />
                        </button>
                      </div>
                      <div className="reply_input_div" id={comment._id}>
                        <textarea
                          className="reply_input"
                          placeholder="Write a reply..."
                          value={reply}
                          rows={3}
                          onChange={(e) => setReply(e.target.value)}
                        ></textarea>
                        <div className="reply_cancel_btn">
                          <button
                            className="reply_btn"
                            id={comment._id}
                            onClick={addReply}
                          >
                            Reply
                          </button>
                          <button
                            className="cancel_reply_btn"
                            onClick={cancelReply}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div className="reply_ampm_div">
                        <button
                          className="comment_reply_btn"
                          id={comment._id}
                          onClick={(e) => handleViewReplies(comment._id)}
                        >
                          {/* View Replies */}
                          {/* {viewReplies ? "Hide Replies" : "View Replies"} */}
                          {viewReplies[comment._id]
                            ? "Hide Replies"
                            : "View Replies"}
                        </button>
                        {
                          // show ellipsis if the comment owner is the current user
                          comment.commenter === currentUser && (
                            <span className="ellipsis_span">
                              <IoEllipsisHorizontalCircle
                                className="ellipsis"
                                onClick={toggleEllipsis}
                              />
                            </span>
                          )
                        }
                      </div>
                      <div className="comment_edit_delete_btn" id={comment._id}>
                        <button
                          id={comment._id}
                          className="edit_comment_btn"
                          onClick={(e) => editComment(e, comment.commenter)}
                        >
                          Edit
                        </button>
                        <button
                          id={comment._id}
                          onClick={deleteComment}
                          className="delete_comment_btn"
                        >
                          Delete
                        </button>
                      </div>
                      {/* replies */}
                      <ul className="replies_list" id={comment._id}>
                        {
                          // check if the replies exist

                          (Array.isArray(replyData[comment._id])
                            ? replyData[comment._id]
                            : []
                          ).map((reply) => (
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
                              <div className="like_reply_btn">
                                <button>
                                  <AiFillLike className="like_icon" />
                                </button>
                                <button>
                                  <AiFillDislike className="like_icon" />
                                </button>
                                {reply.commenter === currentUser && (
                                  <button
                                    className="delete_reply_icon"
                                    id={reply._id}
                                    onClick={deleteReply}
                                  >
                                    delete
                                  </button>
                                )}
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
