import { useState, useEffect } from "react";

function UserRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors]= useState({});
  const [isSubmit, setIsSubmit]=useState(false);

  useEffect(()=>{
    if(Object.keys(formErrors).length===0 && isSubmit){
        console.log({username, password, confirmPassword});
    }
  }, [formErrors])

  const validate=({username, password, confirmPassword})=>{
    const errors={};
    const userNameRegExp=/^[a-zA-Z][a-zA-Z0-9]{4,14}$/i;
    const passwordRegExp=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/i;
    if(!username){
        errors.username="Username is required!"
    }else if(!userNameRegExp.test(username)){
        errors.username =
          "Username must be between 5 and 15 characters in length, start with a letter, and may include numbers. Special characters are not allowed!";
    }
    if(!password){
        errors.password="Password is required!"
    }else if(!passwordRegExp.test(password)){
        errors.password =
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit and a special character!";
    }
    if(!confirmPassword){
        errors.confirmPassword="Confirm Password is required!"
    }else if(confirmPassword!==password){
        errors.confirmPassword="The passwords dont match!"
    }
    return errors;
  }  

  function handleSubmit(event){
    event.preventDefault(); 
    setIsSubmit(true);
    setFormErrors(validate({username, password, confirmPassword}))
  }

  return (
    <div id="user-register">
      <div>Register as a user</div>
      <form onSubmit={handleSubmit} noValidate autoComplete="off" >
        <label htmlFor="username">
          Username:
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>
        <p>{formErrors.username}</p>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        <p>{formErrors.password}</p>
        <label htmlFor="confirmPassword">
          Confirm Password:
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          />
        </label>
        <p>{formErrors.confirmPassword}</p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserRegister; f