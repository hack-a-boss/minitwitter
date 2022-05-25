import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const Auth = () => {
  const { user, logout } = useAuth();

  return user ? (
    <p>
      Logged in as <Link to={`/user/${user.id}`}>{user.email}</Link>{" "}
      <button onClick={() => logout()}>Logout</button>
    </p>
  ) : (
    <ul>
      <li>
        <Link to={"/register"}>Register</Link>
      </li>
      <li>
        <Link to={"/login"}>Login</Link>
      </li>
    </ul>
  );
};
