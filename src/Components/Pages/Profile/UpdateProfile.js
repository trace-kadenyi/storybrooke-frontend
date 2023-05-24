import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { TiTick } from "react-icons/ti";

import MainNavbar from "../../Navigation/MainNavbar";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./profile.css";
import profPicPreloader from "../../../Assets/Images/pic_preloader.gif";
import preloader from "../../../Assets/Images/update.gif";

const UpdateProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/profile" } };

  const [bio, setBio] = useState("");
  const [profPic, setProfPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked
  const [submitted, setSubmitted] = useState(false); // to prevent multiple submissions
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  // fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/profile/${currentUser}`);
        console.log(response.data);
        setUsername(response.data.username);
        setBio(response.data.bio);
        setProfPic(response.data.profilePicture);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(error);
        setLoading(false);
      }
    };

    fetchProfile();

    //eslint-disable-next-line
  }, []);

  // response changes when input fields are updated
  useEffect(() => {
    setResponse("");
  }, [bio, profPic, username]);

  const showToastMessage = () => {
    toast.success(
      `
    ${
      username === currentUser
        ? "Profile successfully updated"
        : "Profile successfully updated. Please log in again with your new username"
    }`,
      {
        position: toast.POSITION.TOP_RIGHT,
        className: "toast-message",
      }
    );
  };

  const handleProfilePicture = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setProfPic(reader.result);
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  // update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userProfile = {
      username,
      bio,
      base64: profPic,
    };
    console.log(userProfile);
    setLoadSubmit(true);
    try {
      const response = await axiosPrivate.put(
        `/profile/${currentUser}`,
        userProfile
      );
      setSubmitted(true);
      // console.log(response.data);
      showToastMessage();
      // if username is changed, navigate to login page else navigate to profile page in 3 seconds
      if (username === currentUser) {
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      } else {
        //  navigate to login and then to the profile page
        navigate("/login", { state: { from } }, { replace: true });
      }
    } catch (error) {
      if (!error.response) {
        setResponse("No server response");
      } else if (error.response.status === 401) {
        setResponse("Unauthorized");
        alert("Unauthorized. Please log in again.");
        // redirect to login page in 3 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (error.response.status === 400) {
        setResponse(error.response.data.message);
      } else {
        setResponse("Something went wrong. Please try again");
      }
    }
    setLoadSubmit(false);
  };

  return (
    <section className="profile_sect">
      <MainNavbar />
      <div className="main_div">
        <form className="update_form" onSubmit={handleSubmit}>
          {/* cover image */}
          <div className="cover_div"></div>
          {/* card with profile details */}
          <div className="user_card">
            <div className="user_card_div input_card_div">
              {/* update image */}
              <div className="user_img">
                <img
                  src={profPic ? profPic : profPicPreloader}
                  alt="profile"
                  className={profPic ? "prof_pic" : "user_img_default"}
                />

                {/* update profile image */}
                <div className="user_img">
                  <input
                    type="file"
                    accept="image/*"
                    name="profilePicture"
                    id="profilePicture"
                    className="inputfile"
                    // src={profPic}
                    alt="profile_picture"
                    onChange={handleProfilePicture}
                  />
                  <label htmlFor="profilePicture" className="label">
                    Update Image
                  </label>
                </div>
              </div>

              {/* update bio */}
              <div className="bio_input_div">
                <label htmlFor="bio" className="label">
                  bio
                </label>
                <textarea
                  type="text"
                  minLength={10}
                  maxLength={250}
                  name="bio"
                  id="bio"
                  className="bio_input"
                  placeholder={loading ? "Loading..." : "Add your bio"}
                  value={bio}
                  autoFocus={!loading ? true : false}
                  autoComplete="off"
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            {/* update username */}
            <div className="profile_username_div profile_username_update">
              <label htmlFor="username" className="label">
                {" "}
                username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className={
                  loading ? "loading_input username_input" : "username_input"
                }
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          {/* submit button */}
          <div className="submit_div">
            <button type="submit" className="update_submit_btn">
              <span>Update Profile</span>
              {/* preloader span */}
              {loadSubmit ? (
                <span className="preloader_span">
                  <img src={preloader} alt="preloader" />
                </span>
              ) : submitted ? (
                <span className="preloader_span">
                  <TiTick className="tick_icon" />
                </span>
              ) : null}
            </button>
          </div>
        </form>
        <div className="by_genre_response">{response}</div>
      </div>
    </section>
  );
};

export default UpdateProfile;
