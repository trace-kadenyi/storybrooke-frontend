import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Registration from "./Components/Registration/Register";
import Login from "./Components/Authentication/Login";
import Layout from "./Components/Pages/Layout";
import LinkPage from "./Components/Pages/LinkPage";
import Home from "./Components/Pages/Home/Home";
import Lounge from "./Components/Pages/Lounge";
import Missing from "./Components/Pages/Missing";
import Unauthorized from "./Components/Pages/Unauthorized";
import Admin from "./Components/Pages/Admin";
import Editor from "./Components/Pages/Editor";
import RequireAuth from "./Components/Pages/RequireAuth";
import UpdateEmployee from "./Components/Pages/UpdateEmployee";
import About from "./Components/Pages/About/About";
import PersistLogin from "./Components/PersistLogin";
import MainPage from "./Components/Pages/MainPages/MainPage/MainPage";
import ReadStories from "./Components/Pages/MainPages/ReadStories/ReadStories";
import ShareStories from "./Components/Pages/MainPages/ShareStories/ShareStories";
import Explore from "./Components/Pages/MainPages/ReadStories/Explore";
import FilterByGenre from "./Components/Pages/MainPages/ReadStories/FilterByGenre";
import FilterByTitle from "./Components/Pages/MainPages/ReadStories/FilterByTItle";
import FilterByAuthor from "./Components/Pages/MainPages/ReadStories/FilterByAuthor";
import MyStories from "./Components/Pages/MainPages/ReadStories/MyStories";
import Profile from "./Components/Pages/Profile/Profile";
import UpdateStory from "./Components/Pages/MainPages/ShareStories/UpdateStory";
import UpdateProfile from "./Components/Pages/Profile/UpdateProfile";
import IndividualStory from "./Components/Pages/MainPages/ReadStories/IndividualStory";
import DeleteAccount from "./Components/Pages/Profile/DeleteAccount";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="register" element={<Registration />} />
          <Route path="login" element={<Login />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* private routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="/about" element={<About />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1984]} />}>
              <Route path="editor" element={<Editor />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[5150]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1984, 5150]} />}>
              <Route path="lounge" element={<Lounge />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[1984, 5150]} />}>
              <Route path="update" element={<UpdateEmployee />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="main" element={<MainPage />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="read" element={<ReadStories />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="share" element={<ShareStories />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="explore" element={<Explore />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="by_genre" element={<FilterByGenre />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="by_title" element={<FilterByTitle />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="by_author" element={<FilterByAuthor />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="my_stories" element={<MyStories />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="update_story/:storyId" element={<UpdateStory />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="update_profile" element={<UpdateProfile />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="story/:storyId" element={<IndividualStory />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route path="delete_account/:username" element={<DeleteAccount />} />
            </Route>
          </Route>
          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
