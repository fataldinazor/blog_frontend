import { useState, useEffect, useRef } from "react";
import { BlogIcon } from "../../assets/Icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userMenu, authorMenu } from "../../utils/helper";

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAuth();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    //cleanup function
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="z-50">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="text-white bg-black border border-white  hover:bg-white hover:text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 md:px-5 py-2.5 text-center inline-flex items-center"
        type="button"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <p className="text-gray-400 ">@<span className="text-white truncate">{auth.userInfo.username}</span></p>
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdown"
        className={`${
          isOpen ? "block" : "hidden"
        } absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          {auth.userInfo.role === "AUTHOR"
            ? authorMenu.map((menu, index) => (
                <li key={index} onClick={()=>setIsOpen(false)}>
                  <Link
                    to={
                      menu.name === "Profile"
                        ? `${menu.url}${auth.userInfo.id}`
                        : `${menu.url}`
                    }
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {menu.name}
                  </Link>
                </li>
              ))
            : userMenu.map((menu, index) => (
                <li key={index} onClick={()=> setIsOpen(false)}>
                  <Link
                    to={menu.url}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {menu.name}
                  </Link>
                </li>
              ))}

          <li onClick={()=>setIsOpen(false)}>
            <hr />
            <div 
              onClick={logout}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Logout
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Header() {
  const { auth} = useAuth();
  return (
    <div
      id="header"
      className="flex items-center justify-between bg-black text-white py-4 px-6 shadow-lg "
    >
      <Link to="/" id="logo" className="flex items-center">
        <BlogIcon height="30" with="30" color="white" />
        <h1 className="hidden md:block text-3xl font-bold ml-2">InqPress</h1>
      </Link>

      <div id="header-navbar" className="flex items-center space-x-6">
        <div id="articlesNav" className="cursor-pointer hover:text-gray-300">
          <Link to="/articles">Articles</Link>
        </div>

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
          <DropDown />
        )}
      </div>
    </div>
  );
}

export default Header;
