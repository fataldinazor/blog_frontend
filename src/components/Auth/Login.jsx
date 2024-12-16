import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { storingGuestToLS, storingUserToLS } from "@/utils/helper";
import { guestLoginAPI, loginUserAPI } from "@/api/authApi";
import toast, { Toaster } from "react-hot-toast";
import { BlogIcon } from "@/assets/Icons";
import { UserIcon } from "@/assets/Icons";
import { AuthLoadingOverlay} from "../Loading";

function Login() {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState();

  //checking if formErrors exists else go for logigging in the client
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      loginUser(formValues.username, formValues.password);
    }
  }, [formErrors]);

  // for creating a guest user
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

  // logging in the client from the backend
  async function loginUser(username, password) {
    setIsLoading(true);
    try {
      const result = await loginUserAPI(username, password);
      if (result.success) {
        const { user, token } = result;
        const expiry = storingUserToLS(user, token);
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
        toast.error(result.msg || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Error Occured", error);
    } finally {
      setIsLoading(false);
    }
  }

  //validating the user i/p on frontend
  function validate(values) {
    let errors = {};
    if (!values.username) {
      errors.username = "Username is required!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));
  }

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
      className="h-full flex justify-center items-center bg-slate-50"
    >
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl min-w-80">
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')`,
          }}
        ></div>

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto">
            <BlogIcon height="30" width="30" color="black" />
          </div>

          <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
            Welcome back!
          </p>

          <button
            onClick={handleGuestUser}
            className="w-full flex items-center justify-center mt-4 bg-emerald-500  text-white transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-emerald-700 dark:hover:bg-gray-600"
          >
            <UserIcon height="25" width="25" />

            <span className="px-4 py-2 font-bold text-center">
              Login as a Guest
            </span>
          </button>

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <p className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 ">
                login with username
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

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium tracking-wide border text-white capitalize transition-colors duration-300 transform bg-black rounded-lg hover:bg-white hover:text-black hover:border-black focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
              Not a User?{" "}
              <span className="text-black hover:text-gray-700 underline">
                <Link to="/register">Register</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
