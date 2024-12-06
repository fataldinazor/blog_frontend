import config from "../config";
const apiUrl = config.apiUrl;

const fetchArticles = async (articleType, userToken, authorId) => {
  const url = `${apiUrl}users/${authorId}/posts/${articleType}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend" + error);
    return [];
  }
};

const fetchAuthorDetails = async (userToken, authorId) => {
  const url = `${apiUrl}users/${authorId}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    // console.log()
    return await response.json();
  } catch (error) {
    console.log("Error from the backend" + error);
    return {};
  }
};

export { fetchArticles, fetchAuthorDetails };
