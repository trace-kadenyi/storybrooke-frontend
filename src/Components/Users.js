import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { getUsers } from "./AppData/getUsers";

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

  // get users on page load
  useEffect(() => {
    if (effectRun.current) {
      getUsers(setUsers, axiosPrivate, navigate, location);
    }

    return () => {
      effectRun.current = true;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <article>
      <h1>Users</h1>
      {users?.length ? (
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users found...</p>
      )}
    </article>
  );
};

export default Users;
