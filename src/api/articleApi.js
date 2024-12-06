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
    // console.log(result)
    return result;
  } catch (error) {
    console.log("Error Occured from backend: ", error);
    return [];
  }
};

const fetchTopAuthors=async(userToken)=>{
  const url=`${apiUrl}posts/authors/top`;
  try {
    const response=await fetch(url,{
      headers:{
        Authorization:`Bearer ${userToken}`,
      },
    });
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json()
  } catch (error) {
    console.error(`Could fetch details ${error}`)
  }
}

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
    // console.log(result);
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
      body: JSON.stringify({ userComment: userComment }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erorr occured from backend", error);
  }
};

//2 requests for checking if the article opened is liked/bookmarked by the user
// returns 2 bool values
const UserLikedBookmarkPost = async (userToken, articleId) => {
  try {
    const urls = [
      `${apiUrl}posts/${articleId}/likes`,
      `${apiUrl}posts/${articleId}/bookmarks`,
    ];
    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }
      return response.json();
    });
    const result = await Promise.allSettled(fetchPromises);
    return {
      liked: result[0].value.liked,
      bookmarked: result[1].value.bookmarked,
    };
  } catch (error) {
    console.error(`Unexpected error: ${error}`);
  }
};

const handleLike = async (userToken, articleId) => {
  const url = `${apiUrl}posts/${articleId}/likes`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) throw new Error(`Failed to connect with backend`);
    return await response.json();
  } catch (error) {
    console.error(`Error occured from Backend ${error}`);
  }
};

const handleBookmark = async (userToken, articleId) => {
  const url = `${apiUrl}posts/${articleId}/bookmarks`;
  const options = { method: "POST",headers: {Authorization: `Bearer ${userToken}`} };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Unable to connect with backend`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error occurred from backend! ${error}`);
  }
};

export {
  fetchAllPublishedArticles,
  fetchArticleWithId,
  fetchMoreArticles,
  fetchComments,
  postUserComment,
  UserLikedBookmarkPost,
  handleLike,
  handleBookmark,
  fetchTopAuthors
};
