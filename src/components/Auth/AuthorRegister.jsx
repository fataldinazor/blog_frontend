import {useState} from 'react'

function AuthorRegister() {
const [formValues, setFormValues] = useState({});
const [formErrors, setFormErrors] = useState({});
function handleSubmit() {
  console.log("mr");
}
return (
  <div
    id="user-register"
    className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border"
  >
    <h1 className="text-2xl font-bold mb-6 text-center">Register as a User</h1>
    <form
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      className="space-y-4"
    >
      {/* First Name */}
      <div>
        <label htmlFor="fname" className="block text-gray-700 font-medium mb-1">
          Username:
        </label>
        <input
          type="text"
          id="fname"
          name="fname"
          placeholder="First Name"
          value={formValues.fname}
          onChange={(event) =>
            setFormValues({ ...formValues, fname: event.currentTarget.value })
          }
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-sm text-red-600 mt-1">{formErrors.fname}</p>
      </div>

      {/* lastName */}
      <div>
        <label htmlFor="lname" className="block text-gray-700 font-medium mb-1">
          Username:
        </label>
        <input
          type="text"
          id="lname"
          name="lname"
          placeholder="Last Name"
          value={formValues.lname}
          onChange={(event) =>
            setFormValues({ ...formValues, lname: event.currentTarget.value })
          }
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-sm text-red-600 mt-1">{formErrors.lname}</p>
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
          onChange={(event) =>
            setFormValues({
              ...formValues,
              confirmPassword: event.currentTarget.value,
            })
          }
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-sm text-red-600 mt-1">
          {formErrors.confirmPassword}
        </p>
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

export default AuthorRegister
