import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors]= useState({});
  const [isSubmit, setIsSubmit]=useState(false);
  const navigate=useNavigate();

  useEffect(()=>{
    if(Object.keys(formErrors).length===0 && isSubmit){
        // console.log({username, password, confirmPassword});
    }
  }, [formErrors, isSubmit])

  const validate=({username, password, confirmPassword})=>{
    const errors={};
    const userNameRegExp=/^[a-zA-Z][a-zA-Z0-9]{4,14}$/i;
    // const passwordRegExp=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/i;
    if(!username){
        errors.username="Username is required!"
    }else if(!userNameRegExp.test(username)){
        errors.username =  
          "Username must be between 5 and 15 characters in length, start with a letter, and may include numbers. Special characters are not allowed!";
    }
    if(!password){
        errors.password="Password is required!"
    }
    // }else if(!passwordRegExp.test(password)){
    //     errors.password =
    //       "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit and a special character!";
    // }
    if(!confirmPassword){
        errors.confirmPassword="Confirm Password is required!"
    }else if(confirmPassword!==password){
        errors.confirmPassword="The passwords dont match!"
    }
    return errors;
  }  

  async function signupUser(username, password, confirmPassword){
    try {
      const url = `http://localhost:3000/api/v1/auth/user/signup`;
      const response = await fetch(url, {
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password, confirmPassword})
      })
      const result = await response.json();
      console.log(result);
      const {success, token, user} = result;
      if(success){
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", user.username);
        navigate(`/articles`)
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleSubmit(event){
    event.preventDefault(); 
    setIsSubmit(true);
    setFormErrors(validate({username, password, confirmPassword}));
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      signupUser(username, password, confirmPassword)
    }
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
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
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
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
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
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
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

export default UserRegister;