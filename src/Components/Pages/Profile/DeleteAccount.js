import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainNavbar from "../../Navigation/MainNavbar";
import { toast } from "react-toastify";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import AuthContext from "../../../Context/AuthProvider";
import "./profile.css";
import preloader from "../../../Assets/Images/submit.gif";

const DeleteAccount = () => {
  const { setPersist } = useContext(AuthContext);
  const { username } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loadSubmit, setLoadSubmit] = useState(false); // to show preloader when submit button is clicked

  // delete account
  const deleteAccount = async () => {
    setLoadSubmit(true);
    try {
      const response = await axiosPrivate.delete(`/users/${username}`);
      toast.success(response.data.message);
      localStorage.clear();
      navigate("/login");
      setPersist(false);
    } catch (err) {
      console.log(err);
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
          <button className="back_to_homepage" onClick={() => navigate("/")}>
            <span>GO BACK HOME 😃</span>
          </button>
        </div>
        <div>
          <button
            className="delete_account_permanently"
            onClick={deleteAccount}
          >
            <span>Delete Account Permanently</span>
            {loadSubmit && (
              <span className="preloader_span">
                <img src={preloader} alt="preloader" />
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeleteAccount;
