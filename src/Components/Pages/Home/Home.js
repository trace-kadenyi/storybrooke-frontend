import { useNavigate, Link, NavLink, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

import { useContext } from "react";
import AuthContext from "../../../Context/AuthProvider";
import logo from "../../../Assets/Images/logo.png";
import "./home.css";

const Home = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { name } = useParams();

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    showToastMessage();
    setAuth({});
  };

  const showToastMessage = () => {
    toast.success(`See you later ${
      JSON.parse(localStorage.getItem("user"))
    } 👋`, {
      position: toast.POSITION.TOP_RIGHT,
      className: "toast-message",
    });
  };

  return (
    <section className="home_sect">
      <header className="login_header">
        <nav>
          <img
            src={logo}
            alt="logo"
            className="logo"
          />
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
              <NavLink to="/login" className="link" onClick={logout}>
                Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <div className="home_main_div">
        <Link to="/editor">Go to the Editor page</Link>
        <br />
        <Link to="/admin">Go to the Admin page</Link>
        <br />
        <Link to="/lounge">Go to the Lounge</Link>
        <br />
        <Link to="/linkpage">Go to the link page</Link>
      </div>
    </section>
  );
};

export default Home;
