import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storingUserToLS } from "../../utils/helper";

function Login() {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  //checking if formErrors exists else go for logigging in the client
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      loginUser(formValues.username, formValues.password);
    }
  }, [formErrors]);

  // logging in the client from the backend
  async function loginUser(username, password) {
    try {
      const url = `http://localhost:3000/api/v1/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      const { success, user, token } = result;
      if (success) {
        const expiry = storingUserToLS(user, token);
        if (typeof expiry === "number") {
          setAuth({
            isAuthenticated: true,
            token: token,
            userInfo: user,
            expiry: expiry,
          });
          navigate("/articles");
        } else {
          // Show the error
          console.log(expiry);
          navigate("/login");
        }
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(`Error:${error}`);
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

  return (
    <div
      id="login"
      className="max-w-md mx-auto my-auto mt-10 p-6 bg-white outline-dashed rounded-lg shadow-md border"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Login into your Account
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="space-y-2"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-1"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formValues.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
          <p className="text-sm text-red-600 mt-1">{formErrors.username}</p>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
          <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white border py-2 px-4 rounded-lg hover:border-black hover:bg-white hover:text-black hover:font-semibold transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
