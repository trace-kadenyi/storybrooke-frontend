import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import useLogout from "../hooks/useLogout";
import AuthContext from "../Context/AuthProvider";

const Logout = () => {
  const { setPersist } = useContext(AuthContext);
  const logout = useLogout();

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
  return (
      <NavLink to="/login" className="link" onClick={signOut}>
        Logout
      </NavLink>
  );
};

export default Logout;
