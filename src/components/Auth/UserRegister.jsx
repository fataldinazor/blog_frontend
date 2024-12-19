import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { storingUserToLS, storingGuestToLS } from "@/utils/helper";
import { signupUserAPI, guestLoginAPI } from "@/api/authApi";
import { BlogIcon, UserIcon } from "@/assets/Icons";
import toast from "react-hot-toast";
import { AuthLoadingOverlay } from "../Loading";


function UserRegister() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      signupUser(
        formValues.username,
        formValues.password,
        formValues.confirmPassword
      );
    }
  }, [formErrors]);

    if (auth.isAuthenticated) {
      navigate("/articles");
    }

  const validate = ({ username, password, confirmPassword }) => {
    const errors = {};
    const regExp = {
      username: /^[a-zA-Z0-9!@#$%^&*()_+]{4,14}$/i,
      password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/i,
    };

    if (!username) {
      errors.username = "Username is required!";
    } else if (!regExp.username.test(username)) {
      errors.username =
        "Username must be between 5 and 15 characters in length, start with a letter, and may include numbers. Special characters are not allowed!";
    }
    if (!password) {
      errors.password = "Password is required!";
    }
    // else if(!regExp.password.test(password)){
    //     errors.password =
    //       "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit and a special character!";
    // }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required!";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "The passwords dont match!";
    }
    return errors;
  };

  //handling the user signup api
  async function signupUser(username, password, confirmPassword) {
    try {
      const result = await signupUserAPI(username, password, confirmPassword);
      if (result?.success) {
        const { token, user } = result;
        const expiry = storingUserToLS(user, token);
        setAuth({
          isAuthenticated: true,
          token: token,
          userInfo: user,
          expiry: expiry,
        });
        toast.success("User Created Succesfully...Redirecting");
        navigate("/articles");
      } else {
        toast.error(
          result.msg.errors[0].msg || "Failed to create a new User! Try again Later"
        );
        console.log("Failed to create a new User: ", result.msg.errors[0]);
        return;
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      toast.error("Failed in creating a new Member");
    } finally {
      setIsLoading(false);
    }
  }

  // signing up the guest user  
  const handleGuestUser = async () => {
    setIsLoading(true);
    try {
      const result = await guestLoginAPI();
      if (result.success) {
        const { user, token } = result;
        const expiry = storingGuestToLS(user, token);
        setAuth({
          isAuthenticated: true,
          token: token,
          userInfo: user,
          expiry: expiry,
        });
        toast.success("Login successful! Redirecting...", {
          duration: 4000,
        });
        navigate("/articles");
      } else {
        toast.error(result.msg || "Guest Login Failed");
      }
    } catch (error) {
      console.log("Falied to create Guest User! ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // handling the submission of the form
  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));
  }

  // handling the change on Input field
  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  if (isLoading) {
    return <AuthLoadingOverlay />;
  }

  return (
    <div
      id="login-container"
      className="h-full w-full flex justify-center items-center bg-slate-50"
    >
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl min-w-80">
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          }}
        ></div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto">
            <BlogIcon height="30" width="30" color="black" />
          </div>

          <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
            Welcome to InqPress
          </p>

          <button
            onClick={handleGuestUser}
            className="w-full flex items-center justify-center mt-4 bg-emerald-500  text-white transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-emerald-700 dark:hover:bg-gray-600"
          >
            <UserIcon height="25" width="25" />

            <span className="px-4 py-2 font-bold text-center">
              Sign Up as a Guest
            </span>
          </button>

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <p className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 ">
                Sign up with username
              </p>

              <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>

            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formValues.username}
                onChange={handleChange}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <p className="text-sm text-red-600 mt-1">{formErrors.username}</p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleChange}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                  htmlFor="password"
                >
                  Confirm Password
                </label>
              </div>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter your password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <p className="text-sm text-red-600 mt-1">
                {formErrors.confirmPassword}
              </p>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium tracking-wide border text-white capitalize transition-colors duration-300 transform bg-black rounded-lg hover:bg-white hover:text-black hover:border-black focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
              Already a Member/Author?{" "}
              <span className="text-black hover:text-gray-700 underline">
                <Link to="/login">Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
