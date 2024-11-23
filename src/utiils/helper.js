//storing creadentials from register and login components
export function storingUserToLS(user, token) {
    const validity = 24 * 60 * 60 * 1000;
    // const validity=10*1000;
    const expiry = new Date().getTime() + validity;
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("expiry", expiry.toString());
    return expiry;
  } catch (error) {
    console.log("Couldn't access localStorage", error)
    return error;
  }
}
