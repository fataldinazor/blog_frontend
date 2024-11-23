// import React, {useState} from "react";
import blogIcon from "../../assets/blogIcon.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const {auth, logout}=useAuth();
  return (
    <div
      id="header"
      className="flex items-center justify-between bg-gray-800 text-white py-4 px-6 shadow-lg"
    >
      {/* Logo Section */}
      <div id="logo" className="flex items-center">
        <img
          src={blogIcon}
          alt="WebsiteIcon"
          className="h-10 w-10 mr-3 rounded-full"
        />
        <h1 className="text-2xl font-bold">BlogSite</h1>
      </div>

      {/* Navbar Section */}
      <div id="header-navbar" className="flex items-center space-x-6">
        <div id="articlesNav" className="cursor-pointer hover:text-gray-300">
          <Link to="/articles">Articles</Link>
        </div>

        {/* Conditional Rendering for Auth Navigation */}
        {!auth.isAuthenticated ? (
          <div id="authNav" className="flex items-center space-x-4">
            <button
              id="loginBtn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition duration-300"
            >
              <Link to="/login">Login</Link>
            </button>
            <button
              id="registerBtn"
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md transition duration-300"
            >
              <Link to="/register">Register</Link>
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md transition duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
