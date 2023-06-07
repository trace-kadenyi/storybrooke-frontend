import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import MainNavbar from "../../Navigation/MainNavbar";
import Blueprint from "../MainPages/ReadStories/Blueprint";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./profile.css";
import preloader from "../../../Assets/Images/bio_preloader.gif";
import profPicPreloader from "../../../Assets/Images/pic_preloader.gif";
import storiesPreloader from "../../../Assets/Images/main.gif";
import { coverImgDefault } from "../../AppData/data";
import defaultCover from "../../../Assets/Images/about.png";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [profileInterests, setProfileInterests] = useState([]);
  const [bio, setBio] = useState("");
  const [profPic, setProfPic] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadProfile, setLoadProfile] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [active, setActive] = useState(0);

  const controller = new AbortController();

  // fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadProfile(true);
        const response = await axiosPrivate.get(`/profile/${currentUser}`);
        console.log(response.data);
        setFirstName(response.data.firstname);
        setLastName(response.data.lastname);
        setUsername(response.data.username);
        setBio(response.data.bio);
        setProfPic(response.data.profilePicture);
        response.data.coverPicture.includes("data:image")
          ? setCoverPic(response.data.coverPicture)
          : setCoverPic(defaultCover);
        setDateJoined(response.data.dateJoined);
        setLoadProfile(false);
      } catch (err) {
        console.log(err);
        setError(error);
        setLoadProfile(false);
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
        <div className="cover_div">
          <img
            src={coverPic ? coverPic : defaultCover}
            className="cover_pic"
            alt="cover_img"
          />
        </div>
        {/* card with profile details */}
        <div className="user_card">
          <div className="user_card_div">
            <div className="user_img">
              <img
                src={profPic ? profPic : profPicPreloader}
                className={profPic ? "prof_pic" : "user_img_default"}
                alt="user_img"
              />
            </div>
            {!loadProfile && (
              <div className="edit_icon_div">
                {/* edit icon */}
                <AiFillEdit className="edit_icon" onClick={handleEditClick} />
              </div>
            )}
            <div className="bio">
              {/* preloader */}
              {loadProfile && (
                <div className="preloader_div">
                  {<img src={preloader} alt="preloader" />}
                </div>
              )}
              <p>{bio}</p>
            </div>
          </div>
          <div className="profile_username_div main_profile_username_div">
            {!loadProfile && (
              <div className="date_joined_div">
                <p className="date_joined">
                  Joined:{" "}
                  <span className="date_span">
                    {dateJoined && dateJoined.slice(0, 10)}
                  </span>
                </p>
              </div>
            )}
            <div className="profile_names_div">
              <p className="username_span_para">
                <span className="username_span">{firstName}</span>
                {/* space */} <span className="username_span">{lastName}</span>
              </p>

              {!loadProfile && <p className="profile_username">({username})</p>}
            </div>
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
                    <div className="main_preloader">
                      <img
                        src={storiesPreloader}
                        alt="preloader"
                        className="main_preloader_img"
                      />
                    </div>
                  ) : stories.length > 0 ? (
                    stories.map((story) => {
                      return <Blueprint key={story._id} story={story} />;
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
