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
    if (!response.ok) {
      const errorResult = await response.json();
      return errorResult;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(`Error:${error}`);
    return {sucess:false, msg: "Network Falied" };
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
    if (!response.ok) {
      const errorResult = await response.json();
      return errorResult;
    }
    return await response.json();
  } catch (error) {
    console.log("Error" + error);
    return {sucess:false, msg: "Network Falied" };
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
    if (!response.ok) {
        const errorResponse= await response.json();
        return errorResponse;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(`Error ${error}`);
    return ({sucess:false, msg:"Network Falied"})
  }
}
export { loginUserAPI, signupUserAPI, signupAuthorAPI};
