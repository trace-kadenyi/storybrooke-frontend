import { Link } from "react-router-dom";
import MainNavbar from "../Navigation/MainNavbar";

const Missing = () => {
  return (
    <section>
      <MainNavbar />
      <article className="missing_page">
        <h1>Oops!</h1>
        <p>Page Not Found</p>
        <div className="flexGrow">
          <Link to="/" className="missing_link">
            Visit Our Homepage
          </Link>
        </div>
      </article>
    </section>
  );
};

export default Missing;
