import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Logout from "../../Logout";
import logo from "../../../Assets/Images/logo.png";
import { btnOptions } from "../../AppData/Data";
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
    //eslint-disable-next-line
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
    //eslint-disable-next-line
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
          {btnOptions.sort().map((btn, index) => {
            return (
              <button
                key={index}
                className="home_main_div_btns_btn"
                onClick={handleClick}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
      <div className="next_btn_div">
        <button>
          <NavLink to="/stories" className="next_btn">
            Next
          </NavLink>
        </button>
      </div>
    </section>
  );
};

export default Home;
