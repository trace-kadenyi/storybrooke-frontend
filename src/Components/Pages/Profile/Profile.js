import React from "react";
import { Link } from "react-router-dom";

import MainNavbar from "../../Navigation/MainNavbar";
import logo from "../../../Assets/Images/logo.png";
import "./profile.css";

const Profile = () => {
  const userName = JSON.parse(localStorage.getItem("user"));
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
                src="https://www.w3schools.com/howto/img_avatar.png"
                className="prof_pic"
                alt="user_img"
              />
            </div>
            <div className="bio">
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus
                mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.
              </p>
            </div>
          </div>
          <div className="profile_username">
            <h4>{userName}</h4>
          </div>
        </div>
        {/* profile contents */}
        <div className="profile_content_main_div">
          <div className="profile_intro"></div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
