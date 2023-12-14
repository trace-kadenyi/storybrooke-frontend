 // handle fetch replies
 const handleFetchReplies = async (e) => {
     const commentID = e.currentTarget.id;
     console.log(`before ${commentID}`);
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
 
       if (response.data.length > 0) {
         console.log(replyData[commentID]);
       }
       console.log(`After ${commentID}`);
     } catch (error) {
       console.log(error);
     }
     const repliesBtn = document.querySelector(
       `.comment_reply_btn[id="${commentID}"]`
     );
     repliesBtn.style.visibility = "hidden";
     // log replydata length
   };

// Replies date
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

     // add reply
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
 
       // check if reply list is empty
       const replyList = document.querySelector(
         `.replies_list[id="${commentID}"]`
       );
       // if (replyList.innerHTML === `<p class="no_replies">No replies yet</p>`) {
       //   replyList.innerHTML = "";
       // }
 
       setReplyData({
         ...replyData,
         [commentID]: [...replyData[commentID], { ...response.data.reply }],
       });
 
       // clear the reply input
       setReply("");
 
       // hide the reply input
       const replyDiv = document.querySelector(
         `.reply_input_div[id="${commentID}"]`
       );
       replyDiv.style.display = "none";
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
 
       if (!newReplies.length) {
         const replyList = document.querySelector(
           `.replies_list[id="${commentID}"]`
         );
 
         replyList.innerHTML = `<p class="no_replies">No replies yet</p>`;
       }
     } catch (error) {
       console.log(error);
     }
   };

   
     // handle cancel reply button
  const cancelReply = (e) => {
     const cancelBtn = e.currentTarget;
     const replyDiv = cancelBtn.parentElement.parentElement;
     replyDiv.style.display = "none";
   };
 




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