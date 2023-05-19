import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainNavbar from "../../Navigation/MainNavbar";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./update_pages.css";

const UpdateProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
        setProfPic(response.data.profilePicture);
        setDateJoined(response.data.dateJoined);
      } catch (err) {
        console.log(err);
        setError(error);
      }
    };
    fetchProfile();
    //eslint-disable-next-line
  }, []);

  return (
    <section className="profile_sect">
      <MainNavbar />
      <div className="main_div">
        <form className="update_form">
          {/* cover image */}
          <div className="cover_div"></div>
          {/* card with profile details */}
          <div className="user_card">
            <div className="user_card_div">
              {/* update image */}
              <div className="user_img">
                <img src={profPic} alt="profile" className="prof_pic" />

                {/* update profile image */}
                <div className="user_img">
                  <input
                    type="file"
                    accept="image/*"
                    name="profilePicture"
                    id="profilePicture"
                    className="inputfile"
                    // onChange={(e) => setProfPic(e.target.files[0])}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setProfPic(e.target.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <label htmlFor="profilePicture" className="label">
                    Update Image
                  </label>
                </div>
              </div>

              {/* update bio */}
              <div className="bio">
                <p>{bio}</p>
              </div>
            </div>
            <div className="profile_username">
              <h4>{username}</h4>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateProfile;
