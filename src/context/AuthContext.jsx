import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: !!localStorage.getItem("token"),
    token: localStorage.getItem("token"),
    userInfo: getUserInfo(),
    expiry: getExpiry(),
  });
  let location = useLocation();
  const navigate = useNavigate();

  //checking for the token validity at each page change and
  // logging out the user if token expired
  useEffect(() => {
    checkTokenValidity(auth.expiry);
  }, [location, auth.expiry]);

  //This is done for safer handling of JSON data
  //To get String values from localStorage and parsing that to json
  function getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || "";
    } catch (error) {
      console.error("Couldn't fetch data from localStorage", error);
      return "";
    }
  }
  //getting the expiryTime
  function getExpiry() {
    try {
      const expiry = Number(localStorage.getItem("expiry"));
      return expiry;
    } catch (error) {
      console.error("Couldn't fetch data from localStorage", error);
      return;
    }
  }

  //checks for token validity and logs out the 
  // user if validity no more
  function checkTokenValidity(expiry) {
    const currentTime = new Date().getTime();
    if (expiry <= currentTime) logout();
  }


  // Logging out User
  function logout() {
    localStorage.clear();
    setAuth({ isAuthenticated: false, token: "", userInfo: "" });
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
