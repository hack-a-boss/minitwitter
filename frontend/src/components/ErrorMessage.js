import { Link } from "react-router-dom";

export const ErrorMessage = ({ message }) => {
  return (
    <>
      <h1>Error</h1>
      <p>{message}</p>
      <Link to={"/"}>Go to home</Link>
    </>
  );
};
