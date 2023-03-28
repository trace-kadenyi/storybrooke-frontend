import React, { useEffect, useState } from "react";
import { useNavigate, Link, NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useContext } from "react";
import AuthContext from "../../../Context/AuthProvider";
import useLogout from "../../../hooks/useLogout";
import logo from "../../../Assets/Images/logo.png";
import "./home.css";

const Home = () => {
  const { setPersist } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = useLogout();
  const { name } = useParams();
  const [interests, setInterests] = useState([]);

  const signOut = async () => {
    showToastMessage();
    await logout();
    // clear local storage
    localStorage.clear();
    // uncheck the persist checkbox
    setPersist(false);
  };

  const showToastMessage = () => {
    toast.success(
      `See you later ${JSON.parse(localStorage.getItem("user"))} 👋`,
      {
        position: toast.POSITION.TOP_RIGHT,
        className: "toast-message",
      }
    );
  };

  useEffect(() => {
    if (localStorage.getItem("interests")) {
      setInterests(JSON.parse(localStorage.getItem("interests")));
      // add active class to the buttons
      const btns = document.querySelectorAll(".home_main_div_btns_btn");
      btns.forEach((btn) => {
        if (interests.includes(btn.innerText)) {
          btn.classList.add("active");
        }
      });
    } else {
      setInterests([]);
    }
  }, [interests.length]);

  const handleClick = (e) => {
    e.target.classList.toggle("active");
    if (interests.includes(e.target.innerText)) {
      const index = interests.indexOf(e.target.innerText);
      interests.splice(index, 1);
    } else {
      interests.push(e.target.innerText);
    }
    console.log(interests);
    localStorage.setItem("interests", JSON.stringify(interests));
  };

  return (
    <section className="home_sect">
      <header className="login_header">
        <nav>
          <img src={logo} alt="logo" className="logo" />
          <ul>
            <li>
              <NavLink to="/about" className="link">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/editor" className="link">
                Editor
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin" className="link">
                Admin
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className="link" onClick={signOut}>
                Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <div className="home_main_div">
        <p className="interests">Select your areas of interest below...</p>
        <div className="home_main_div_btns">
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Technology
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Politics
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Sports
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Entertainment
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Business
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Science
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Health
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Travel
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Food
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Fashion
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Art
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Music
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Books
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Movies
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            TV
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Gaming
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Education
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            History
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Philosophy
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Psychology
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Religion
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Society
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Environment
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Economics
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
