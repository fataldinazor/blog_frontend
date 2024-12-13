import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storingUserToLS } from "../../utils/helper";
import { signupAuthorAPI } from "@/api/authApi";
import toast from "react-hot-toast";

function AuthorRegister() {
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
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
      // console.log(formValues);
      createNewAuthor(
        formValues.fname,
        formValues.lname,
        formValues.username,
        formValues.password,
        formValues.confirmPassword
      );
    }
  }, [formErrors]);

  // sending the values to the backend bia api
  async function createNewAuthor(
    fname,
    lname,
    username,
    password,
    confirmPassword
  ) {
    const result = await signupAuthorAPI(
      fname,
      lname,
      username,
      password,
      confirmPassword
    );
    if (result?.success) {
      const { token, user } = result;
      const expiry = storingUserToLS(user, token);
      setAuth({
        isAuthenticated: true,
        token: token,
        userInfo: user,
        expiry: expiry,
      });
      toast.success(
        result.msg || "The Author Profile is created successfully!"
      );
      navigate("/articles");
    } else {
      toast.error(result.msg || "Problem creating Author Profile");
      console.log(result);
    }
  }

  function validate(values) {
    const errors = {};
    const regExp = { username: /^[a-zA-Z0-9!@#$%^&*()_+]{4,14}$/i };

    if (!values.fname) {
      errors.fname = "First Name is required!";
    }
    if (!values.lname) {
      errors.lname = "Last Name is required!";
    }
    if (!values.username) {
      errors.username = "Username is required";
    } else if (!regExp.username.test(values.username)) {
      errors.username =
        "Username must be between 4-14 characters without any space\n Numbers and Special Characters are allowed";
    }
    if (!values.password) {
      errors.password = "password is required!";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required!";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "The passwords don't match!";
    }
    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  }
  return (
    <div
      id="user-register"
      className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Register as an Author
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="space-y-2"
      >
        <div id="author-register-name" className="flex w-full">
          {/* First Name */}
          <div id="author-register-fname" className="mr-2 w-full">
            <label
              htmlFor="fname"
              className="block text-gray-700 font-medium mb-1 w-full"
            >
              First
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              placeholder="First Name"
              value={formValues.fname}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-600 mt-1">{formErrors.fname}</p>
          </div>

          {/* lastName */}
          <div id="author-register-lname" className="ml-2 w-full">
            <label
              htmlFor="lname"
              className="block text-gray-700 font-medium mb-1"
            >
              Last
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              placeholder="Last Name"
              value={formValues.lname}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-600 mt-1">{formErrors.lname}</p>
          </div>
        </div>

        {/* Username */}
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

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 mt-10"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AuthorRegister;
