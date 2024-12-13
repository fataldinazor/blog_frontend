import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storingUserToLS } from "../../utils/helper";
import { signupUserAPI } from "@/api/authApi";
import toast from "react-hot-toast";
function UserRegister() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      signupUser(
        formValues.username,
        formValues.password,
        formValues.confirmPassword
      );
    }
  }, [formErrors]);

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
      toast.error(result.msg || "Failed to create a new User! Try again Later");
      console.log("Failed to create a new User");
    }
  }

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
    // console.log(formValues);
  }

  return (
    <div
      id="user-register"
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Register as a User
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="space-y-4"
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
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-1"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-sm text-red-600 mt-1">
            {formErrors.confirmPassword}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default UserRegister;
