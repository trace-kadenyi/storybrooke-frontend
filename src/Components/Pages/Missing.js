import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <article className="missing_page">
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link to="/" className="missing_link">Visit Our Homepage</Link>
      </div>
    </article>
  );
};

export default Missing;