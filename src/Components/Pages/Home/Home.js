import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Logout from "../../Logout";
import logo from "../../../Assets/Images/logo.png";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState([]);
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const effectRun = useRef(false);

  const name = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    if (effectRun.current) {
      getUsers();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
    //eslint-disable-next-line
  }, []);

  // find id of logged in user
  const foundId = users?.find((user) => user.username === name)?._id;
  console.log(foundId);

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
    // push selected interests to the database
    const updateInterests = async () => {
      try {
        const response = await axiosPrivate.put(`/`, {
          id: foundId,
          interests: interests,
        });
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    updateInterests();
  };

  // fetch interests from user
  useEffect(() => {
    const getInterests = async () => {
      try {
        const response = await axiosPrivate.get(`/users`);
        // return the interests of the logged in user
        const userInterests = response.data.find(
          (user) => user.username === name
        ).interests;
        console.log(userInterests);
        // set the interests in the local storage
        localStorage.setItem("interests", JSON.stringify(userInterests));
        // set the interests in the state
        setInterests(userInterests);
      } catch (err) {
        console.log(err);
      }
    };
    getInterests();
  }, []);

  return (
    <section className="home_sect">
      <header className="login_header">
        <nav>
          <NavLink to="/" className="link">
            <img src={logo} alt="logo" className="logo" />
          </NavLink>
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
              <Logout />
            </li>
          </ul>
        </nav>
      </header>
      <div className="home_main_div">
        <p className="interests">
          Customize your account. Select the topics that interest you below.
          What do you like reading and/or writing about?
        </p>
        <div className="home_main_div_btns">
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Fiction
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Non-Fiction
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Romance
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Thriller
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Who-done-it
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Historical
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Western
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Fantasy
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Paranormal
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Folklore
          </button>
          <button className="home_main_div_btns_btn" onClick={handleClick}>
            Poetry
          </button>
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
            Sci-Fi
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
      <div className="stories_btn_div">
        <button>
          <NavLink to="/stories" className="stories_btn">
            Next
          </NavLink>
        </button>
      </div>
    </section>
  );
};

export default Home;
