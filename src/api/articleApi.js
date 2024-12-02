import config from "../config";
const { apiUrl } = config;

const fetchAllPublishedArticles = async (userToken) => {
  try {
    const url = `${apiUrl}posts`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error Occured from backend: ", error);
    return [];
  }
};

const fetchArticleWithId = async (userToken, articleId) => {
  try {
    const url = `${apiUrl}posts/${articleId}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend: " + error);
  }
};

const fetchMoreArticles = async (userToken, articleId) => {
  try {
    const url = `${apiUrl}posts/${articleId}/more-posts`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend: " + error);
  }
};

const fetchComments = async (userToken, articleId) => {
  try {
    const url = `${apiUrl}posts/${articleId}/comments`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend: " + error);
  }
};

const postUserComment = async (userToken, articleId, userComment) => {
  try {
    // console.log(userComment, userToken, articleId)
    const url = `${apiUrl}posts/${articleId}/comments`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({userComment:userComment}),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erorr occured from backend", error);
  }
};

export {
  fetchAllPublishedArticles,
  fetchArticleWithId,
  fetchMoreArticles,
  fetchComments,
  postUserComment,
};
