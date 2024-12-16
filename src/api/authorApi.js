import config from "../config";
const apiUrl = config.apiUrl;

const { cloudName, avatarPresetName } = config;

// uploading image to Cloudinary and generating a link to store in imageUrl
const uploadToCloudinaryAPI = async (image) => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", avatarPresetName);
    formData.append("tags", "avatar-image");
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Couldn't upload to Cloudinary",
      };
      return errorMessage;
    }
    const result = await response.json();
    return { success: true, image_url: result.secure_url };
  } catch (error) {
    console.error("Error occured while uploading to cloudinary", error);
    return {
      success: false,
      networkError: true,
      msg: "Failed to connect to Cloudinary server, Please check your internet connection",
    };
  }
};

const updateAuthorPageAPI = async (formValues, token, authorId) => {
  console.log(formValues);
  const url = `${apiUrl}users/${authorId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formValues),
    });
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Profile couldn't be updated",
      };
      return errorMessage;
    }
    return await response.json();
  } catch (error) {
    console.log("Error Occured" + error);
    return {
      success: false,
      networkError: true,
      msg: "Unable to connect to the server. Please check your internet connection.",
    };
  }
};

const fetchAuthorArticlesAPI = async (articleType, userToken, authorId) => {
  const url = `${apiUrl}users/${authorId}/posts/${articleType}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      networkError: true,
      msg: "Unable to connect to the server. Please check your internet connection.",
    };
  }
};

const fetchBookmarkedPostsAPI = async (userToken, authorId) => {
  const url = `${apiUrl}users/${authorId}/posts/bookmarks`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error Occured" + error);
    return {
      success: false,
      networkError: true,
      msg: "Unable to connect to the server. Please check your internet connection.",
    };
  }
};

const fetchAuthorDetailsAPI = async (userToken, authorId) => {
  const url = `${apiUrl}users/${authorId}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      const errorMessage = {
        success: false,
        msg: "Couldn't fetch author details",
      };
      return errorMessage;
    }
    return await response.json();
  } catch (error) {
    console.log("Error Occured" + error);
    return {
      success: false,
      networkError: true,
      msg: "Unable to connect to the server. Please check your internet connection.",
    };
  }
};

export {
  uploadToCloudinaryAPI,
  fetchAuthorArticlesAPI,
  fetchAuthorDetailsAPI,
  updateAuthorPageAPI,
  fetchBookmarkedPostsAPI,
};
