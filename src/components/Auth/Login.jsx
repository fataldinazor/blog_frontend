import React, { useEffect, useState } from "react";

function Login() {
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

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
      const result = response.json();
      const {success, user, token}=result;
      if(success){
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", user.username);
      }
    } catch (error) {
      console.log(`Error:${error}`);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmit(true);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      loginUser(formValues.username, formValues.password);
    }
  }
  return (
    <div
      id="user-register"
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Login into your Account
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="space-y-4"
      >
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
            onChange={(event) =>
              setFormValues({
                ...formValues,
                username: event.currentTarget.value,
              })
            }
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
            onChange={(event) =>
              setFormValues({
                ...formValues,
                password: event.currentTarget.value,
              })
            }
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
        </div>

        {/* Submit Button */}
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

export default Login;
