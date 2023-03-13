import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

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
  }, []);

  return (
    <article>
      <h1>Employees</h1>
      {employees?.length ? (
        <ul>
          {employees.map((employee, index) => (
            <li key={index}>{employee.firstname}</li>
          ))}
        </ul>
      ) : (
        <p>No employees found...</p>
      )}
    </article>
  );
};

export default Employees;
