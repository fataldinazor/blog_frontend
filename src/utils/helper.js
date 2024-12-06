//storing creadentials from register and login components
function storingUserToLS(user, token) {
  const validity = 24 * 60 * 60 * 1000;
  const expiry = new Date().getTime() + validity;
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("expiry", expiry.toString());
    return expiry;
  } catch (error) {
    console.log("Couldn't access localStorage", error);
    return error;
  }
}

function truncateString(str, count) {
  if (str.length < count) {
    return str;
  }
  return str.substr(0, count) + "...";
}

// format date for display
function formatDate(date) {
  const currDate = new Date();
  if (new Date(date).getFullYear() === currDate.getFullYear()) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  } else {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

const userMenu = [
  { name: "Homepage", url: "/" },
  { name: "Articles", url: "/articles" },
];
const authorMenu = [
  { name: "Profile", url: "/author/" },
  { name: "Create New", url: "/articles/new" },
  { name: "HomePage", url: "/" },
  { name: "Articles", url: "/articles" },
];

export { storingUserToLS, truncateString, formatDate, userMenu, authorMenu };
