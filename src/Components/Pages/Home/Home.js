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
        {/* <Link to="/editor">Go to the Editor page</Link>
        <br />
        <Link to="/admin">Go to the Admin page</Link>
        <br />
        <Link to="/lounge">Go to the Lounge</Link>
        <br />
        <Link to="/linkpage">Go to the link page</Link> */}
        <p className="interests">Select your areas of interest below...</p>
        <div className="home_main_div_btns">
          <button className="home_main_div_btns_btn">Technology</button>
          <button className="home_main_div_btns_btn">Politics</button>
          <button className="home_main_div_btns_btn">Sports</button>
          <button className="home_main_div_btns_btn">Entertainment</button>
          <button className="home_main_div_btns_btn">Business</button>
          <button className="home_main_div_btns_btn">Science</button>
          <button className="home_main_div_btns_btn">Health</button>
          <button className="home_main_div_btns_btn">Travel</button>
          <button className="home_main_div_btns_btn">Food</button>
          <button className="home_main_div_btns_btn">Fashion</button>
          <button className="home_main_div_btns_btn">Art</button>
          <button className="home_main_div_btns_btn">Music</button>
          <button className="home_main_div_btns_btn">Books</button>
          <button className="home_main_div_btns_btn">Movies</button>
          <button className="home_main_div_btns_btn">TV</button>
          <button className="home_main_div_btns_btn">Gaming</button>
          <button className="home_main_div_btns_btn">Education</button>
          <button className="home_main_div_btns_btn">History</button>
          <button className="home_main_div_btns_btn">Philosophy</button>
          <button className="home_main_div_btns_btn">Psychology</button>
          <button className="home_main_div_btns_btn">Religion</button>
          <button className="home_main_div_btns_btn">Society</button>
          <button className="home_main_div_btns_btn">Environment</button>
          <button className="home_main_div_btns_btn">Economics</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
