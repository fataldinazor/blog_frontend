import config from "@/config";
const { apiUrl } = config;

async function loginUserAPI(username, password) {
  try {
    const url = `${apiUrl}auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(`Error:${error}`);
    return { sucess: false, msg: "Network Failure, Check Internet Connection" };
  }
}

async function guestLoginAPI() {
  const url = `${apiUrl}auth/guest-login`;
  try {
    const response = await fetch(url, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return {success:false, networkError:true, msg:"Network Failure, Check Internet Connection", error}
  }
}

async function signupUserAPI(username, password, confirmPassword) {
  try {
    const url = `${apiUrl}auth/user/signup`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, confirmPassword }),
    });
    return await response.json();
  } catch (error) {
    console.log("Error" + error);
    return { sucess: false, msg:"Network Failure, Check Internet Connection" };
  }
}

async function signupAuthorAPI(
  fname,
  lname,
  username,
  password,
  confirmPassword
) {
  try {
    const url = `${apiUrl}auth/author/signup`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname,
        lname,
        username,
        password,
        confirmPassword,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(`Error ${error}`);
    return { sucess: false, msg: "Network Failure, Check Internet Connection" };
  }
}
export { loginUserAPI, guestLoginAPI, signupUserAPI, signupAuthorAPI };
