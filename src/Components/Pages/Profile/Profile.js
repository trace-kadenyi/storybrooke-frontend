import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import MainNavbar from "../../Navigation/MainNavbar";
import Blueprint from "../MainPages/ReadStories/Blueprint";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./profile.css";
import preloader from "../../../Assets/Images/bio_preloader.gif";
import profPicPreloader from "../../../Assets/Images/pic_preloader.gif";
import storiesPreloader from "../../../Assets/Images/main.gif";
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
  const getInterests = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  // handle fetch stories
  const handleFetchStories = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/story/author/${currentUser}`, {
        signal: controller.signal,
      });
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

  // handle tabs
  const handleTabs = (index) => {
    setActive(index);
    // if index is 1, fetch interests
    if (index === 1) {
      getInterests();
      // hide profile_stories_div
      const profileStoriesDiv = document.querySelector(".profile_stories_div");
      profileStoriesDiv.style.display = "none";
    }
    // if index is 2, fetch stories
    if (index === 2) {
      handleFetchStories();
      // display profile_stories_div
      const profileStoriesDiv = document.querySelector(".profile_stories_div");
      profileStoriesDiv.style.display = "block";
    } else {
      setStories([]);
      setProfileInterests([]);
      setResponse("");
    }
  };

  // handle edit click
  const handleEditClick = () => {
    navigate("/update_profile");
  };

  // handle delete account
  const handleDeleteAccount = () => {
    // hide the main div behind a black background
    const mainDiv = document.querySelector(".main_div");
    mainDiv.style.opacity = "0.2";
    mainDiv.style.pointerEvents = "none";

    // Create a custom component for the toast content
    const DeleteAccountConfirmation = () => (
      <div className="del_acc_div">
        <p>
          Are you sure you want to delete your account permanently? This action
          cannot be undone.
        </p>
        <div className="delete_acc_toast_div">
          <button onClick={confirmDeleteAccount} className="yes">
            Yes
          </button>
          <button onClick={cancelDeleteAccount} className="no">
            No
          </button>
        </div>
      </div>
    );

    // Display the confirmation toast
    toast.info(<DeleteAccountConfirmation />, {
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
  const confirmDeleteAccount = () => {
    navigate(`/delete_account/${currentUser}`);
    toast.dismiss(); // Close the toast after navigation
    // fix main div
    const mainDiv = document.querySelector(".main_div");
    mainDiv.style.opacity = "1";
    mainDiv.style.pointerEvents = "auto";
  };

  // Function to cancel deleting the account
  const cancelDeleteAccount = () => {
    toast.dismiss(); // Close the toast
    // fix main div
    const mainDiv = document.querySelector(".main_div");
    mainDiv.style.opacity = "1";
    mainDiv.style.pointerEvents = "auto";
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
              <div className="acc_details">
                <div className="date_joined_div">
                  <p className="date_joined">
                    Joined:{" "}
                    <span className="date_span">
                      {dateJoined && dateJoined.slice(0, 10)}
                    </span>
                  </p>
                </div>
                <div>
                  <button
                    className="delete_story_btn delete_acc_btn"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
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
        {!loadProfile && (
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
                {loading ? (
                  <div className="main_preloader">
                    <img
                      src={storiesPreloader}
                      alt="preloader"
                      // className="main_preloader_img"
                    />
                  </div>
                ) : (
                  profileInterests.map((interest) => (
                    <div className="profile_interests_item" key={interest}>
                      <p>{interest}</p>
                    </div>
                  ))
                )}
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
        )}
      </div>
    </section>
  );
};

export default Profile;
