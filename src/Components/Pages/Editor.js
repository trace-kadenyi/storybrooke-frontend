import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Editor = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [response, setResponse] = useState("");
  const [employees, setEmployees] = useState();
  const [id, setId] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

  // get employees
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getEmployees = async () => {
      try {
        const response = await axiosPrivate.get("/employees", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setEmployees(response.data);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    if (effectRun.current) {
      getEmployees();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
    //eslint-disable-next-line
  }, []);

  // create employee
  const createEmployee = async (e) => {
    try {
      const response = await axiosPrivate.post(
        "/employees",
        JSON.stringify({ firstname: firstName, lastname: lastName }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setResponse(response.data.message);
      setEmployees([
        ...employees,
        {
          firstname: firstName,
          lastname: lastName,
        },
      ]);
      console.log(JSON.stringify(response?.data));
      setFirstName("");
      setLastName("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEmployee();
  };

  // delete employee
  const deleteEmployee = async (id, e) => {
    try {
      const response = await axiosPrivate.delete("/employees", {
        data: JSON.stringify({ id: id }),
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setResponse(response.data.message);
      setEmployees(employees.filter((employee) => employee._id !== id));
      setId("");
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <section>
      <h1>Editors Page</h1>
      <br />
      {/* list employees */}
      <article>
        <h1>Employees</h1>
        {employees?.length ? (
          <ol>
            {employees.map((employee, index) => (
              <li key={index}>{`
              ${employee._id !== undefined ? employee._id : "Processing ID"}
              : ${employee.firstname} ${employee.lastname}`}</li>
            ))}
          </ol>
        ) : (
          <p>No employees found...</p>
        )}
      </article>
      <br />
      {/* create employees */}
      <form onSubmit={handleSubmit}>
        <div>
          <p>{response}</p>
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
            required
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
            required
          />
        </div>
        <div>
          <button type="submit">Create Employee</button>
        </div>
      </form>

      {/* delete employee */}
      <form>
        <div>
          <label htmlFor="id">Delete Employee</label>
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
          <button type="button" onClick={() => deleteEmployee(id)}>
            Delete Employee
          </button>
        </div>
      </form>

      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Editor;
