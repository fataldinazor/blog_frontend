// import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Register() {
  const location = useLocation();
  return (
    <div>
      {/* {console.log(location)} */}
      {location.pathname === "/register" && (
        <div id="register-choice" className="flex w-full flex-auto justify-between">
          <div id="user-register-link">
            <Link to="user">User</Link>
            {/* Describing features of being a User */}
          </div>
          <div id="author-register-link">
            <Link to="author">Author</Link>
            {/* decribing the characterstics of being an author */}
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}

export default Register;
