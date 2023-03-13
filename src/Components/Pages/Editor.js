import { Link } from "react-router-dom";
import Employees from "../Employees";

const Editor = () => {
  return (
    <section>
      <h1>Editors Page</h1>
      <br />
      <Employees />
      <br />
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Editor;
