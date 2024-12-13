import config from "../config";
const apiUrl = config.apiUrl;

const { cloudName, avatarPresetName } = config;

// uploading image to Cloudinary and generating a link to store in imageUrl
const uploadToCloudinary = async (image) => {
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
    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Error occured while uploading to cloudinary", error);
    return null;
  }
};

const updateAuthorPage = async (formValues, token, authorId) => {
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
    if(!response.ok){
      throw new Error(`HTTP error occured`)
    }
    return await response.json();
  } catch (error) {
    console.log("Error Occured"+ error);
  }
};

const fetchArticles = async (articleType, userToken, authorId) => {
  const url = `${apiUrl}users/${authorId}/posts/${articleType}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      return await response.json();
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error occured from backend" + error);
    return [];
  }
};

const fetchBookmarkedPostsAPI=async(userToken, authorId)=>{
  const url=`${apiUrl}users/${authorId}/posts/bookmarks`;
  try {
    const response = await fetch(url,{
      headers:{
        Authorization: `Bearer ${userToken}`
      }
    })
    if(!response.ok){
      const errorMessage = await response.json();
      return errorMessage
    }
    const result= await response.json();
    console.log(result)
    return result;
  } catch (error) {
    return {msg:"Network Error", error}
  }
}

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
    return await response.json();
  } catch (error) {
    console.log("Error from the backend" + error);
    return {};
  }
};

export {
  fetchArticles,
  fetchAuthorDetails,
  uploadToCloudinary,
  updateAuthorPage,
  fetchBookmarkedPostsAPI
};
