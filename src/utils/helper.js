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
    return;
  }
}

function storingGuestToLS(user, token) {
  const validity = 30* 24 * 60 * 60 * 1000;
  const expiry = new Date().getTime() + validity;
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("expiry", expiry.toString());
    return expiry;
  } catch (error) {
    console.log("Couldn't access localStorage", error);
    return;
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
  { name: "Articles", url: "/articles" },
  { name: "Homepage", url: "/" },
];
const authorMenu = [
  { name: "Create New", url: "/articles/new" },
  { name: "Articles", url: "/articles" },
  { name: "Profile", url: "/author/" },
  { name: "Homepage", url: "/" },
];

const roles=[
  {
    title: "Member",
    description: "Ideal for those who want to explore and engage with published content.",
    buttonText: "Become Member",
    link:"user",
    features: [
      "View all published Articles",
      "Like & Comment on Articles",
      "Share the Post with others",
      "View Profiles of Authors"
    ],
    includedFeatures: [true, true, true, true],
  },
  {
    title: "Author",
    description: "Perfect for content creators who want to share their voice and engage with the audience.",
    buttonText: "Become author",
    link:"author",
    features: [
      "All the access included in Member Role",
      "Publish your own Articles",
      "Bookmark articles",
      "Get a Personalised Profile Page"
    ],
    includedFeatures: [true, true, true, true],
  }
];

export { storingUserToLS, storingGuestToLS, truncateString, formatDate, userMenu, authorMenu, roles };
