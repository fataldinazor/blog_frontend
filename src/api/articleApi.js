import config from "../config";
const { apiUrl, presetName, cloudName } = config;

const uploadToCloudinary = async (image) => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", presetName);
    formData.append("tags", "cover-image");
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Error occured while uploading to cloudinary", error);
    return null;
  }
};

const createNewArticleAPI = async (userToken, formValues) => {
  const url = `${apiUrl}posts/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(formValues),
    });
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Couldn't create the Article, Try again later",
      };
      return errorMessage;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error Occurred", error);
  }
};

const fetchAllPublishedArticlesAPI = async (userToken) => {
  try {
    const url = `${apiUrl}posts`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Couldn't Fetch the Articles",
      };
      return errorMessage;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Network Error: ", error);
  }
};

const fetchTopAuthorsAPI = async (userToken) => {
  const url = `${apiUrl}posts/authors/top`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Couldn't Fetch the Top Contributers",
      };
      return errorMessage;
    }
    return await response.json();
  } catch (error) {
    console.error(`Could fetch details ${error}`);
  }
};

const fetchArticleWithIdAPI = async (userToken, articleId) => {
  const url = `${apiUrl}posts/${articleId}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!response.ok) {
      if (response.status === 404) {
        const errorMessage = await response.json();
        return errorMessage;
      }
      const errorMessage = {
        success: false,
        msg: "Couldn't fetch the Article",
      };
      return errorMessage;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend: " + error);
  }
};

const updateArticleWithId = async (userToken, articleId, formValues) => {
  const url = `${apiUrl}posts/${articleId}`;
  console.log(userToken, articleId, formValues);
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(formValues),
    });
    if (!response.ok) {
      throw new Error(`HTTP error!, status, ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error Occured from backend" + error);
  }
};

const fetchMoreArticlesAPI = async (userToken, articleId) => {
  try {
    const url = `${apiUrl}posts/${articleId}/more-posts`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!response.ok) {
      const errorMessage={success:false, msg:"Couldn't fetch articles"};
      return errorMessage
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend: " + error);
  }
};

const fetchCommentsAPI = async (userToken, articleId) => {
  try {
    const url = `${apiUrl}posts/${articleId}/comments`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      const errorMessage={success:false, msg:"Couldn't fetch the comments"};
      return errorMessage
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend: " + error);
  }
};

const postUserCommentAPI = async (userToken, articleId, userComment) => {
  try {
    const url = `${apiUrl}posts/${articleId}/comments`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ userComment: userComment }),
    });
    if(!response.ok){
      const errorMessage={success:false, msg:"Couldn't Post your Comment"};
      return errorMessage;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erorr occured from backend", error);
  }
};

//2 requests for checking if the article opened is liked/bookmarked by the user
// returns 2 bool values
const UserLikedBookmarkPostAPI = async (userToken, articleId) => {
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
        const errorMessage={success:false, msg:"Couldn't fetch User Like/Bookmark"}
        return errorMessage;
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

const handleLikeAPI = async (userToken, articleId) => {
  const url = `${apiUrl}posts/${articleId}/likes`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    // if (!response.ok) throw new Error(`Failed to connect with backend`);
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Failed to perform like action",
      };
      return errorMessage;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error occured from Backend ${error}`);
  }
};

const handleBookmarkAPI = async (userToken, articleId) => {
  const url = `${apiUrl}posts/${articleId}/bookmarks`;
  const options = {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}` },
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Failed to perform Bookmark action",
      };
      return errorMessage;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error occurred from backend! ${error}`);
  }
};

const deletePostWithId = async (userToken, articleId, imageUrl) => {
  const url = `${apiUrl}posts/${articleId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });
    if (!response.ok) {
      throw new Error(`Failed to Delete the post`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error occurred from backend! ${error}`);
  }
};

export {
  uploadToCloudinary,
  fetchAllPublishedArticlesAPI,
  fetchArticleWithIdAPI,
  updateArticleWithId,
  createNewArticleAPI,
  fetchMoreArticlesAPI,
  fetchCommentsAPI,
  postUserCommentAPI,
  UserLikedBookmarkPostAPI,
  handleLikeAPI,
  handleBookmarkAPI,
  fetchTopAuthorsAPI,
  deletePostWithId,
};
