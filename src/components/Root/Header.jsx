// import React, {useState} from "react";
import blogIcon from "../../assets/blogIcon.svg";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div id="header" className="flex">
      <div id="logo" className="leftPart">
        <img src={blogIcon} alt="WebsiteIcon" />
      </div>
      <div id="header-navbar" className="RightPart">
        <div id="articlesNav" className="cursor-pointer">
          <Link to="articles/">Articles</Link>
        </div>
        {/* conditional rendering while deciding whether the user is logged in or not*/}
        <div id="authNav">
          <button id="loginBtn">
            {" "}
            <Link to="login/">Login</Link>
          </button>
          <button id="registerBtn">
            <Link to="register/">Register</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
