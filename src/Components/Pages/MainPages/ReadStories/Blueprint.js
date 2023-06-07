import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import MainNavbar from "../../../Navigation/MainNavbar";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";
import preloader from "../../../../Assets/Images/main.gif";

const Blueprint = ({ story }) => {
  const navigate = useNavigate();

  // handle view story
  const handleViewStory = (e) => {
    const storyId = e.currentTarget.id;
    console.log(storyId);
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
      <p className="story_body">{story.body.substring(0, 200)}...</p>
    </div>
  );
};

export default Blueprint;
