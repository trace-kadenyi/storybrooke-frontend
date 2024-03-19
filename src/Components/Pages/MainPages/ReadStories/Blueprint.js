import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Blueprint = ({ story }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // handle view story
  const handleViewStory = (e) => {
    const storyId = e.currentTarget.id;
    navigate(`/story/${storyId}`);
  };

  return (
    <div key={story._id} className="individual_story">
      <div className="title_date">
        <div className="title_author">
          <p
            onClick={handleViewStory}
            id={story._id}
            className="individual_story_link"
          >
            <span className="story_title">{story.title} </span>
            <span className="by">by </span>
            <span className="story_author">{story.author}</span>
          </p>
        </div>
        <span className="story_date">Created: {story.date.slice(0, 10)}</span>
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
      <p className="story_body">
        {/* if story isn't on profile page, show only 200 characters */}
        {location.pathname.includes("profile")
          ? story.body[0].substring(0, 100) + "..."
          : story.body[0].substring(0, 200) + "..."}
      </p>
      {/* comments length */}
      <span
        className="likes_para story_comments_para"
        onClick={handleViewStory}
        id={story._id}
      >
        <i className="fas fa-comments"></i>{" "}
        {story.comments.length === 1
          ? `${story.comments.length} comment`
          : `${story.comments.length} comments`}
      </span>
      {/* no of likes */}
      <span
        className="likes_para"
        id={story._id}
      >
        <i className="fas fa-comments"></i>{" "}
        {story.likes.length === 1
          ? `${story.likes.length} like`
          : `${story.likes.length} likes`}
      </span>
    </div>
  );
};

export default Blueprint;
