export const getUsers = async (setUsers, axiosPrivate, navigate, location) => {
  let isMounted = true;
  const controller = new AbortController();

  try {
    const response = await axiosPrivate.get("/users", {
      signal: controller.signal,
    });
    // console.log(response.data);
    isMounted && setUsers(response.data);
  } catch (err) {
    console.log(err);
    navigate("/login", { state: { from: location }, replace: true });
  }
};
