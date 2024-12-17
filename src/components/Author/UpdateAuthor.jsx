import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinaryAPI, updateAuthorPageAPI } from "@/api/authorApi";
import toast from "react-hot-toast";
import { LoadingOverlay } from "../Loading";
import { CrossIcon, ModifyIcon, TrashIcon } from "@/assets/Icons";

function UpdateAuthor({ author, showEdit, setShowEdit, setAuthor }) {
  const imageInputRef = useRef(null);
  const [image, setImage] = useState({
    file: null,
    imagePreview: author?.profile?.avatar_url || null,
  });
  const [imageErrors, setImageErrors] = useState("");
  const [formValues, setFormValues] = useState({
    fname: author?.fname || "",
    lname: author?.lname || "",
    bio: author?.profile?.bio || "",
    avatar_url: author?.profile?.avatar_url || null,
  });

  const { auth } = useAuth();
  const params = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    if (image.imagePreview) {
      const prevImagePreview = image.imagePreview;
      //unmounting cleanup function when image Preview is changed
      return () => URL.revokeObjectURL(prevImagePreview);
    }
  }, [image.imagePreview]);

  //tracking the form Errors after submit is clicked before sending to the backend
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setIsLoading(true);
      handleAuthorInfo(image);
    }
  }, [formErrors, isSubmit]);

  //if close btn is clicked (a warning is given if form data changed)
  function handleCloseForm() {
    if (isFormDirty) {
      const confirmExit = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page without saving"
      );
      if (!confirmExit) {
        return;
      }
    }
    setIsFormDirty(false);
    setShowEdit(false);
  }

  // uploading the new image to cloidinary and then sending relevant details to the backend
  async function handleAuthorInfo(image) {
    setIsSubmit(false);
    let cloudinaryUpload = null;
    let updatedFormValues = { ...formValues };

    if (image.file) {
      try {
        cloudinaryUpload = await uploadToCloudinaryAPI(image.file);
        if (cloudinaryUpload.networkError) {
          toast.error(cloudinaryUpload.msg);
          return;
        }
        if (!cloudinaryUpload.success) {
          updatedFormValues = { ...updatedFormValues, old_avatar_url: null };
          toast.error("Failed to upload image to Cloudinary, Try again later!");
        } else {
          updatedFormValues.avatar_url = cloudinaryUpload.image_url;
          updatedFormValues = {
            ...updatedFormValues,
            old_avatar_url: author?.profile?.avatar_url || null,
          };
        }
        setFormValues(updatedFormValues);
      } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        updatedFormValues = { ...updatedFormValues, old_avatar_url: null };
        toast.error("Failed to upload image to Cloudinary, Try again later!");
      }
    } else {
      if (author?.profile?.avatar_url !== null && image.imagePreview === null) {
        updatedFormValues.avatar_url = null;
        updatedFormValues = {
          ...updatedFormValues,
          old_avatar_url: author?.profile?.avatar_url,
        };
      } else if (
        author?.profile?.author_url === null &&
        image.imagePreview === null
      ) {
        updatedFormValues = {
          ...updatedFormValue,
          avatar_url: null,
          old_avatar_url: null,
        };
      }
    }

    try {
      const update = await updateAuthorPageAPI(
        updatedFormValues,
        auth.token,
        params.authorId
      );
      if (update.networkError) {
        toast.error(update.msg);
        return;
      }
      if (!update.success) {
        toast.error(update.msg);
      } else {
        toast.success(update.msg);
      }
    } catch (error) {
      toast.error("Error updating author information");
      console.log(`Error updating author info`, error);
    } finally {
      setIsLoading(false);
      setShowEdit(false);
      setAuthor(null);
      URL.revokeObjectURL(image.imagePreview);
    }
  }

  //handling changes when formValues enetered
  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
    setIsFormDirty(true);
  }

  //handle form submit -> doing further validations and check
  function handleFormSubmit(event) {
    event.preventDefault();
    if (!isFormDirty) {
      setShowEdit(false);
      return;
    }
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
    setIsFormDirty(true);
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
    const defaultImagePreview = author?.profile?.avatar_url || null;
    const setValidationError = (errorMessage) => {
      setImageErrors(errorMessage);
      setImage({
        file: null,
        imagePreview: defaultImagePreview,
      });
      return false;
    };

    if (!acceptedFileTypes.includes(file.type)) {
      return setValidationError(
        "The file must be in .jpg, .jpeg, or .png format"
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return setValidationError("File size exceeds 2MB, unable to upload!");
    }

    setImageErrors("");
    return true;
  }

  // handling the removal of avatar image
  function handleRemoveImage() {
    imageInputRef.current.value = null;
    setImage({ file: null, imagePreview: null });
    setIsFormDirty(true);
  }

  // handle changing the avatar
  function handleChangeImage() {
    setImage({ file: null, imagePreview: author?.profile?.avatar_url || null });
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
      imageInputRef.current.click();
    }
  }

  {
    if (showEdit) {
      return (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
          <dialog
            id="my_modal_1"
            className={`z-20 h-auto min-w-80 max-w-screen-md p-4 rounded-lg mx-auto block`}
          >
            <div className="modal-box">
              {isLoading && <LoadingOverlay />}
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">Edit Profile</h3>
                <button className="btn" onClick={handleCloseForm}>
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

export default UpdateAuthor;
