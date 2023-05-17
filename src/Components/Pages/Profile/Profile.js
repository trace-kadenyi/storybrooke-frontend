import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import MainNavbar from "../../Navigation/MainNavbar";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./profile.css";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [profileInterests, setProfileInterests] = useState([]);
  const [bio, setBio] = useState("");
  const [profPic, setProfPic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [active, setActive] = useState(0);

  const controller = new AbortController();

  // create profile

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const userProfile = {
  //    firstName,
  //     lastName,
  //     username,
  //     bio,
  //     profPic,
  //   };
  //   console.log(userProfile);

  //   try {
  //     const response = await axiosPrivate.post("/story", userProfile);
  //     console.log(response.data);
  //     setFirstName("");
  //     setLastName("");
  //     setUsername("");
  //     setBio("");

  //     // shift focus to top of page
  //     // window.scrollTo(0, 0);

  //     // show toast message
  //     // showToastMessage(response.data.message);
  //   } catch (error) {
  //     if (!error.response) {
  //       setResponse("No server response");
  //     } else if (error.response.status === 401) {
  //       setResponse("Unauthorized");
  //       alert("Unauthorized. Please log in again.");
  //       // redirect to login page in 3 seconds
  //       setTimeout(() => {
  //         window.location.href = "/login";
  //       }, 3000);
  //     } else if (error.response.status === 400) {
  //       setResponse(error.response.data.message);
  //       // alert(error.response.data.message);
  //     } else if(error.response.status === 404){
  //       setResponse(error.response.data.message);
  //     }
  //     else {
  //       setResponse("Something went wrong. Please try again");
  //     }
  //   }
  // };

  // fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get(`/profile/${currentUser}`);
        console.log(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setUsername(response.data.username);
        setBio(response.data.bio);
        setProfPic(response.data.profPic);
        setDateJoined(response.data.dateJoined);
      } catch (err) {
        console.log(err);
        setError(error);
      }
    };
    fetchProfile();
    //eslint-disable-next-line
  }, []);

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
        setProfileInterests(
          userInterests.sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
          )
        );
        console.log(profileInterests);
      } catch (err) {
        console.log(err);
        setError(error);
      }
    };
    getInterests();
    //eslint-disable-next-line
  }, []);

  // handle tabs
  const handleTabs = (index) => {
    setActive(index);
    // if index is 2, fetch stories
    if (index === 2) {
      handleFetchStories();
    } else {
      setStories([]);
      setResponse("");
    }
  };

  // handle fetch stories
  const handleFetchStories = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/story/author/${currentUser}`, {
        signal: controller.signal,
      });
      console.log(response.data);
      setStories(response.data);
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

  // handle edit click
  const handleEditClick = () => {
    navigate("/update_profile");
  };

  return (
    <section className="profile_sect">
      <MainNavbar />
      <div className="main_div">
        {/* cover image */}
        <div className="cover_div"></div>
        {/* card with profile details */}
        <div className="user_card">
          <div className="user_card_div">
            <div className="user_img">
              <img
                src={
                  profPic
                    ? profPic
                    : "https://www.w3schools.com/howto/img_avatar.png"
                }
                className="prof_pic"
                alt="user_img"
              />
            </div>
            <div className="edit_icon_div">
              {/* edit icon */}
              <AiFillEdit className="edit_icon" onClick={handleEditClick} />
            </div>
            <div className="bio">
              <p>{bio}</p>
            </div>
          </div>
          <div className="profile_username">
            <h4>{username}</h4>
          </div>
        </div>
        {/* profile contents */}
        <div className="profile_content_main_div">
          <div className="links_container">
            <button
              className={active === 1 ? "tabs active_tabs" : "tabs"}
              onClick={() => handleTabs(1)}
            >
              {currentUser}'s Interests
            </button>
            <button
              className={active === 2 ? "tabs active_tabs" : "tabs"}
              onClick={() => handleTabs(2)}
            >
              {currentUser}'s Stories
            </button>
          </div>

          {/* interests */}
          <div className={active === 1 ? "active_content" : "content"}>
            <div className="profile_interests_list">
              {profileInterests.map((interest) => (
                <div className="profile_interests_item" key={interest}>
                  <p>{interest}</p>
                </div>
              ))}
            </div>
          </div>
          {/* stories */}
          <div className="profile_stories_div">
            {/* display found stories by the author */}
            <div>
              <>
                <div className="all_stories">
                  {loading ? (
                    <p className="load_stories">Loading...</p>
                  ) : stories.length > 0 ? (
                    stories.map((story) => {
                      return (
                        <div key={story._id} className="individual_story">
                          <div className="title_date">
                            <p className="title_author">
                              <span className="story_title">
                                {story.title}{" "}
                              </span>
                              <span className="by">by </span>
                              <span className="story_author">
                                {story.author}
                              </span>
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
                    })
                  ) : (
                    <div className="by_genre_response">{response}</div>
                  )}
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
