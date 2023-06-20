import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainNavbar from "../../Navigation/MainNavbar";
import { toast } from "react-toastify";
import { TiTick } from "react-icons/ti";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./profile.css";
import preloader from "../../../Assets/Images/submit.gif";

const DeleteAccount = () => {
  // obtain username from url
  const { username } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked
  const [submitted, setSubmitted] = useState(false); // to prevent multiple submissions
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);

  // delete account
  const deleteAccount = async () => {
    setLoadSubmit(true);
    try {
      const response = await axiosPrivate.delete(`/users/${username}`);
      setResponse(response.data.message);
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
      setLoadSubmit(false);
      toast.error(err.response.data.message);
    }
    setLoadSubmit(false);
  };

  return (
    <section className="delete_acc_sect">
      <MainNavbar />
      <div className="delete_acc_main">
        <>
          <p className="sad_emoji">🥺</p>
          <p className="goodbye">We're sorry to see you go...</p> <br />
          <p className="goodbye_text">
            All your data will be deleted from our database (except anonymous
            stories). If you published any stories with us, we advice you to
            back them up just in case you need to use them in the future.
          </p>
        </>
        <div>
          <button
            className="delete_account_permanently"
            onClick={deleteAccount}
          >
            <span>Delete Account Permanently</span>
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
      </div>
    </section>
  );
};

export default DeleteAccount;
