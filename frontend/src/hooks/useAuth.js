import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyDataService } from "../services";

const useAuth = () => {
  const { token, setToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getMyDataService(token);

        setUser(data);
      } catch (error) {
        setToken("");
        setUser(null);
      }
    };

    if (token) getUserData();
  }, [token, setToken]);

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const login = (token) => {
    setToken(token);
  };

  return { token, user, logout, login };
};

export default useAuth;
