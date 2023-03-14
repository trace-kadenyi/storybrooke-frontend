import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UpdateEmployee = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [response, setResponse] = useState("");
  const [id, setId] = useState("");
  const axiosPrivate = useAxiosPrivate();

  // update employee
  const updateEmployee = async (e, id) => {
    e.preventDefault();
    // only submit if at least 1 field is filled out
    if (firstName === "" && lastName === "") {
      setResponse("Please fill out at least 2 fields");
      return;
      // return if id is not filled out
    } else if (!id) {
      setResponse("Employee ID is required");
      return;
    }

    try {
      const response = await axiosPrivate.put(
        "/employees",
        {
          id: id,
          firstname: firstName,
          lastname: lastName,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setResponse("Employee has been updated successfully");
      setId("");
      setFirstName("");
      setLastName("");
      console.log(JSON.stringify(response?.data));
    } catch (err) {
      if (err.response.status === 401) {
        setResponse("Unauthorized");
      } else if (err.response.status === 403) {
        setResponse("Forbidden");
      } else if (err.response.status === 404) {
        setResponse("Not Found");
      } else if (err.response.status === 500) {
        setResponse("Internal Server Error");
      } else {
        setResponse("Something went wrong");
      }
    }
  };
  return (
    <section>
      {/* update employee */}
      <form>
        <div>
          <p>{response}</p>
        </div>
        <div>
          <label htmlFor="id">Enter Employee ID</label>
          <input
            type="text"
            name="id"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <button type="submit" onClick={(e) => updateEmployee(e, id)}>
            Update Employee
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateEmployee;
