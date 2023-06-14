import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import MainNavbar from "../../../Navigation/MainNavbar";
import Blueprint from "./Blueprint";
import logo from "../../../../Assets/Images/logo.png";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./read.css";
import preloader from "../../../../Assets/Images/main.gif";

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const effectRun = useRef(false);
  const axiosPrivate = useAxiosPrivate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // fetch interests from user
  useEffect(() => {
    const getInterests = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/users`);
        // return the interests of the logged in user
        const userInterests = response.data.find(
          (user) => user.username === currentUser
        ).interests;
        // set the interests in the state in alphabetical order
        setInterests(
          userInterests.sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
          )
        );
        console.log(interests);
      } catch (err) {
        console.log(err);
        setError(error);
      }
    };
    getInterests();
    //eslint-disable-next-line
  }, []);

  // get stories based on interests/genres
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // get the stories from each genre in the interests array
    const getStoriesFromInterests = async () => {
      try {
        setLoading(true);
        const storiesFromInterests = await Promise.all(
          interests.map(async (interest) => {
            const response = await axiosPrivate.get(`/story/find/${interest}`, {
              signal: controller.signal,
            });
            return response.data;
          })
        );

        // remove responses with no stories
        const filteredStories = storiesFromInterests.filter(
          (story) => story.length > 0
        );
        filteredStories.flat();
        // remove duplicates
        const uniqueStories = filteredStories.flat().filter((story, index) => {
          return (
            filteredStories.flat().findIndex((story2) => {
              return story2._id === story._id;
            }) === index
          );
        });
        // sort stories by date
        uniqueStories.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        isMounted && setStories(uniqueStories);
        if (stories.length === 0) {
          setLoading(true);
          setTimeout(() => {
            setResponse("No stories found yet...");
          }, 2000);
        } else if (stories.length > 0) {
          setResponse("");
        }

        setLoading(false);
        return filteredStories;
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (effectRun.current) {
      getStoriesFromInterests();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
    //eslint-disable-next-line
  }, [interests.length]);

  return (
    <section className="explore_sect">
      <MainNavbar />
      <header className="login_header">
        <nav>
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </nav>
      </header>
      <>
        <div className="all_stories">
          <p className="explore_intro">My Stories</p>
          {loading && (
            <div className="main_preloader">
              <img
                src={preloader}
                alt="preloader"
                className="main_preloader_img"
              />
            </div>
          )}
          {error && <p className="error">{error.message}</p>}
          {stories.map((story) => {
            return <Blueprint key={story._id} story={story} />;
          })}
        </div>
        <div className="by_genre_response">
          {stories.length === 0 && response === "No stories found yet..." ? (
            <p className="no_stories">No stories found yet...</p>
          ) : (
            ""
          )}
        </div>
      </>
    </section>
  );
};

export default MyStories;
