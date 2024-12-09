import { useState, useEffect, useRef } from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  EmailIcon,
  LocationIcon,
  TrashIcon,
  ModifyIcon,
  CrossIcon,
} from "../../assets/Icons";
import {
  fetchAuthorDetails,
  uploadToCloudinary,
  updateAuthorPage,
} from "../../api/authorApi";
import { useAuth } from "../../context/AuthContext";
import { Triangle } from "react-loader-spinner";

function EditBox({ author, showEdit, setShowEdit, setAuthor }) {
  const imageInputRef = useRef(null);

  const [image, setImage] = useState({
    file: null,
    imagePreview: author.profile?.avatar_url || null,
  });
  const [imageErrors, setImageErrors] = useState("");
  const [formValues, setFormValues] = useState({
    fname: author.fname || "",
    lname: author.lname || "",
    bio: author.profile.bio || "",
    avatar_url: author.profile.avatar_url || null,
  });

  const { auth } = useAuth();
  const params = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (image.imagePreview) {
  //     const prevImagePreview = image.imagePreview;
  //     //unmounting cleanup function when image Preview is changed
  //     return () => URL.revokeObjectURL(prevImagePreview);
  //   }
  // }, [image.imagePreview]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setIsLoading(true);
      handleAuthorInfo(image);
    }
  }, [formErrors, isSubmit]);

  async function handleAuthorInfo(image) {
    setIsSubmit(false);
    let uploadedAvatarUrl = null;
    let updatedFormValues = { ...formValues };
    if (
      image.imagePreview &&
      image.imagePreview !== author.profile?.avatar_url
    ) {
      if (image.file) {
        console.log(image.imagePreview);
        try {
          uploadedAvatarUrl = await uploadToCloudinary(image.file);
          updatedFormValues.avatar_url = uploadedAvatarUrl;
          setFormValues(updatedFormValues);
        } catch (error) {
          console.error("Error uploading to Cloudinary", error);
        }
      }
    } else if(!image.imagePreview) {
      updatedFormValues.avatar_url = null;
    }

    try {
      await updateAuthorPage(
        {
          ...updatedFormValues,
          old_avatar_url: author.profile?.avatar_url || null,
        },
        auth.token,
        params.authorId
      );
      console.log("update sucessfull");
    } catch (error) {
      console.log(`Error updating author info`, error);
    }
    URL.revokeObjectURL(image.imagePreview);
    setShowEdit(false);
    setIsLoading(false);
    setAuthor(null);
  }

  //handle form submit -> doing further validations and check
  function handleFormSubmit(event) {
    event.preventDefault();
    const { sanitizedValues, errors } = validateFormValues(formValues);
    setFormValues(sanitizedValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
  }

  // the text values of the form are sanitized and validated
  function validateFormValues(values) {
    const errors = {};
    const sanitizedValues = {
      fname: values.fname?.trim() || "",
      lname: values.lname?.trim() || "",
      bio: values.bio?.trim() || "",
      avatar_url: values.avatar_url || "",
    };
    if (!sanitizedValues.fname) {
      errors.fname = "First Name is required!";
    }
    if (!sanitizedValues.lname) {
      errors.lname = "Last Name is required!";
    }
    if (sanitizedValues.bio.length > 300) {
      errors.bio = "Reduce the length of bio under 300 characters ";
    }
    return { sanitizedValues, errors };
  }

  // handling selecting image
  function handleImageSelection(event) {
    console.log("Handle Selection in invoked");
    const file = event.target.files[0];
    const validationResult = imageValidation(file);
    if (!validationResult) {
      event.target.value = null;
    } else {
      const blobUrl = URL.createObjectURL(file);
      setImage({ file: event.target.files[0], imagePreview: blobUrl });
    }
  }

  //handling image validation once image is selected
  function imageValidation(file) {
    const acceptedFileTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (!acceptedFileTypes.includes(file.type)) {
      setImageErrors("The file size should be of .jpg, .jpeg or .png format");
      setImage({
        file: null,
        imagePreview: author.profile?.avatar_url || null,
      });
      return false;
    } else if (file.size > 2 * 1024 * 1024) {
      setImageErrors("File size was over 2MB, Couldn't upload it!");
      setImage({
        file: null,
        imagePreview: author.profile?.avatar_url || null,
      });
      return false;
    } else {
      setImageErrors("");
      return true;
    }
  }

  // handling the removal of avatar image
  function handleRemoveImage() {
    imageInputRef.current.value = null;
    setImage({ file: null, imagePreview: null });
  }

  // handle changing the avatar
  function handleChangeImage() {
    setImage({ file: null, imagePreview: author.profile?.avatar_url || null });
    // setImageErrors("");
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
      imageInputRef.current.click();
    }
  }

  //handling changes when formValues enetered
  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  }

  {
    if (showEdit) {
      return (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
          <dialog
            id="my_modal_1"
            className={`z-20 h-auto min-w-80 max-w-screen-md p-4 rounded-lg mx-auto block`}
            // onClick={(e) => {
            //   if (e.target.tagName === "DIALOG") {
            //     setShowEdit(false);
            //   };
            // }}
          >
            <div className="modal-box">
              {isLoading && (
                <div className="absolute inset-0 bg-white rounded-lg bg-opacity-90 z-30 flex items-center justify-center">
                  <span className="text-lg font-semibold text-black">
                    <Triangle
                      visible={true}
                      height="40"
                      width="40"
                      color="#000000"
                      ariaLabel="triangle-loading"
                    />
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">Edit Profile</h3>
                <button className="btn" onClick={() => setShowEdit(false)}>
                  <CrossIcon height="25" width="25" />
                </button>
              </div>
              <div className="modal-action">
                <form
                  onSubmit={handleFormSubmit}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white"
                >
                  <div className="md:col-span-1 flex flex-col items-center justify-center border border-gray-200 p-4 rounded-md">
                    {!image.imagePreview ? (
                      <label
                        htmlFor="avatar_image"
                        className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-800 cursor-pointer"
                      >
                        <span className="mb-2 text-sm font-medium">
                          Upload your Avatar
                        </span>
                        <div className="h-24 w-24 rounded-full bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            Choose File
                          </span>
                        </div>
                        {imageErrors && (
                          <p className=" mt-1 text-xs text-wrap text-center">
                            {imageErrors}
                          </p>
                        )}
                      </label>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center">
                        <img
                          src={image.imagePreview}
                          alt="Preview"
                          className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-lg"
                        />
                        {imageErrors && (
                          <p className=" mt-1 text-xs text-wrap text-center">
                            {imageErrors}
                          </p>
                        )}
                        <div className="flex mt-4 gap-5">
                          <button type="button" onClick={handleRemoveImage}>
                            <TrashIcon height="25" width="25" />
                          </button>
                          <button type="button" onClick={handleChangeImage}>
                            <ModifyIcon height="23" width="25" />
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      id="avatar_image"
                      name="avatar_url"
                      accept=".jpg, .png, .jpeg"
                      className="hidden"
                      onChange={handleImageSelection}
                    />
                  </div>

                  <div className="text-xs md:text-sm md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <label htmlFor="first-name" className="flex flex-col">
                        <span className="font-medium text-gray-600">
                          First Name
                        </span>
                        <input
                          type="text"
                          name="fname"
                          value={formValues.fname}
                          className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Enter First Name"
                          onChange={handleChange}
                        />
                        <p className=" mt-1 text-xs">{formErrors.fname}</p>
                      </label>
                      <label htmlFor="last-name" className="flex flex-col">
                        <span className="font-medium text-gray-600">
                          Last Name
                        </span>
                        <input
                          type="text"
                          name="lname"
                          value={formValues.lname}
                          className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Enter Last Name"
                          onChange={handleChange}
                        />
                        <p className=" mt-1 text-xs">{formErrors.lname}</p>
                      </label>
                    </div>
                    <label htmlFor="bio" className="flex flex-col">
                      <span className="font-medium text-gray-600">Bio</span>
                      <textarea
                        name="bio"
                        id="bio"
                        value={formValues.bio}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Tell us about yourself (max 300 characters)"
                        onChange={handleChange}
                        rows="4"
                      ></textarea>
                      <p className=" mt-1 text-xs">{formErrors.bio}</p>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white text-sm md:text-base p-2 md:px-5 md:col-span-3 md:justify-self-end rounded-lg"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      );
    }
  }
}

function AuthorInfo() {
  const [author, setAuthor] = useState(null);
  const { auth } = useAuth();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  //fetching when author is null (initially and after updation)
  useEffect(() => {
    if (author === null && !isLoading) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const result = await fetchAuthorDetails(auth.token, params.authorId);
          console.log(result);
          if (result) {
            setAuthor(result);
          }
        } catch (error) {
          console.log("Error" + error);
        } finally {
          setIsLoading(false);
        }
      };
      setTimeout(() => {
        fetchData();
      }, 2000);
    }
  }, [author, params.authorId, auth.token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Triangle
          visible={true}
          height="40"
          width="40"
          color="#000000"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }

  return author ? (
    <div
      id="author-info"
      className="max-w-3xl min-w-96 mx-auto px-2 py-4 grid grid-cols-4"
    >
      {showEdit && (
        <EditBox
          setAuthor={setAuthor}
          author={author}
          showEdit={showEdit}
          setShowEdit={setShowEdit}
        />
      )}
      <div className="flex items-center col-span-1">
        <img
          src={
            author.profile?.avatar_url ||
            "https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"
          }
          alt="author-avatar"
          className="rounded-2xl max-h-40"
        />
      </div>
      <div className="col-span-3 flex flex-col px-2">
        <div className="flex justify-between">
          <div
            id="author-name"
            className="text-xl font-semibold flex md:text-2xl"
          >
            {author.fname} {author.lname}
            <div className=" flex justify-center items-center text-xs px-2 text-gray-500 ml-2 md:ml-4 bg-white border border-slate-700 rounded-3xl my-auto h-6">
              {author.role}
            </div>
          </div>
          {author.id === auth.userInfo.id && (
            <div id="edit-profile">
              <button onClick={() => setShowEdit(true)}>
                <ModifyIcon height={30} />
              </button>
            </div>
          )}
        </div>
        <div
          id="author-username"
          className="text-sm text-gray-500 font-semibold md:text-sm"
        >
          @{author.username}
        </div>
        <div id="author-bio" className="text-xs py-1 md:text-sm  ">
          {author.profile?.bio}
        </div>

        <div className="flex flex-wrap justify-between pt-2">
          <div className="flex flex-wrap items-center text-xs md:text-sm">
            <div className="mr-3 mb-2 inline-flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1  font-medium leading-normal">
              {author._count.posts} Contributions
            </div>
            <div className="mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 font-medium leading-normal">
              {author._count.comments} Comments
            </div>
            <div className="mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 font-medium leading-normal">
              {author._count.likes} Likes
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h2 className="h-28 flex justify-center items-center">
      Failed to fetch the profile
    </h2>
  );
}

function AuthorLayout() {
  return (
    <>
      <AuthorInfo />
      <Outlet />
    </>
  );
}

export default AuthorLayout;
