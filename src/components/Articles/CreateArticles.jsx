import { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "@/config";
import { TrashIcon } from "@/assets/Icons";
import { uploadToCloudinary, createNewArticleAPI } from "@/api/articleApi";
import toast from "react-hot-toast";
import { LoadingOverlay } from "../Loading";

function CreateArticles() {
  const { auth } = useAuth();
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    imageUrl: "",
    isPublished: true,
  });
  const editorRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  //conatains the file
  const [image, setImage] = useState(null);
  //contains the url of the file for showing to ther user
  const [imagePreview, setImagePreview] = useState("");
  const [imageErrors, setImageErrors] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { tinymceKey } = config;
  const [isLoading, setIsLoading] = useState(false);

  //checks for clearing of the errors in form before sending the data to backend
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleBlogValues(image);
    }
  }, [formErrors]);

  //handle blog values after submit and before going to backend
  async function handleBlogValues(image) {
    let cloudinaryUpload = null;
    let updatedValues = formValues;
    setIsLoading(true);
    if (image) {
      try {
        cloudinaryUpload = await uploadToCloudinary(image);
        // console.log(cloudinaryUpload);
        if (cloudinaryUpload.networkError) {
          toast.error(cloudinaryUpload.msg);
          throw new Error(cloudinaryUpload.msg);
        }
        if (!cloudinaryUpload.success) {
          toast.error(cloudinaryUpload.msg);
          updatedValues.imageUrl = null;
        } else {
          updatedValues.imageUrl = cloudinaryUpload.image_url;
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary", error);
      }
    }
    const result = await createNewArticleAPI(auth.token, updatedValues);
    // console.log(result);
    if (!result.success) {
      toast.error(result.msg);
      return;
    }
    toast.success(result.msg);
    setIsLoading(false);
    navigate("/articles");
  }

  //validating the text data for the article
  function validateTextData({ title }) {
    let errors = {};
    const wordcount = editorRef.current.plugins.wordcount.body.getWordCount();

    //checking title errors
    if (title.length < 10) {
      errors.title = "The Title should have at least 15 Characters!";
    } else if (title.length > 300) {
      errors.title = "The title should have less than 300 Characters!";
    }

    //checking content of articles
    if (wordcount < 100) {
      errors.content = "There should be atleast 100 words in you blog content!";
    } else if (wordcount > 3000) {
      errors.content =
        "There should less than 3000 words in your blog content!";
    }
    // console.log(errors);
    return errors;
  }

  // handling changes in form input
  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  //image validation and setup in state
  function imageValidation(file) {
    const acceptedFileTypes = ["image/jpg", "image/png", "image/jpeg"];

    if (!acceptedFileTypes.includes(file.type)) {
      setImageErrors("The file size should be of .jpg, .jpeg or .png format");
      setImage(null);
      return false;
    } else if (file.size > 2 * 1024 * 1024) {
      setImageErrors("The file size is over 2MB, Reduce it");
      setImage(null);
      return false;
    } else {
      setImageErrors("");
      setImage(file);
      return true;
    }
  }

  //handling images input
  async function handleImageSelection(event) {
    const file = event.target.files[0];
    if (file) {
      const validationResult = imageValidation(file);
      if (!validationResult) event.target.value = null;
      else {
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
      }
    }
  }

  //for removing the selected image
  function handleRemoveClick() {
    setImage("");
    setImagePreview("");
  }

  //submitting the articles
  async function handleSubmit(bool) {
    let content = editorRef.current.getContent();
    let title = formValues.title;
    title = title.trim();
    setIsSubmit(true);
    setFormValues({ content: content, title: title, isPublished: bool });
    setFormErrors(validateTextData(formValues));
  }

  if (isLoading) {
    return (
      <div>
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-100 flex justify-center items-center">
      <div
        id="new-post-inputs"
        className="h-full sm:max-w-screen-sm md:max-w-screen-lg lg:max-w-2xl text-black p-6 rounded-md"
      >
        <div id="new-post-image-btn" className="mb-4">
          {!imagePreview ? (
            <>
              <input
                type="file"
                id="coverImage"
                name="image"
                accept=".jpg, .png, .jpeg"
                onChange={handleImageSelection}
                className="w-full cursor-pointer text-sm text-white-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400"
              />
              {imageErrors && (
                <p className="mt-2 text-sm text-gray-500">{imageErrors}</p>
              )}
            </>
          ) : (
            <div className="flex items-center">
              <img
                src={imagePreview}
                alt="cover-image"
                className="w-36 object-cover rounded-md border border-gray-300"
              />
              <button
                onClick={handleRemoveClick}
                className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <TrashIcon height={20} width={20} />
              </button>
            </div>
          )}
        </div>
        <div id="new-post-title-div" className="mb-4">
          <label htmlFor="new-post-title" className="block mb-2 font-semibold">
            Title
          </label>
          <textarea
            type="text"
            id="new-post-title"
            name="title"
            onChange={handleChange}
            rows={2}
            cols={35}
            className="text-xl ms:text-3xl lg:text-3xl font-bold w-full min-h-10 max-h-96 overflow-x-hidden overflow-y-auto bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          ></textarea>
          {formErrors.title && (
            <p className="mt-2 text-sm text-gray-500">{formErrors.title}</p>
          )}
        </div>
        <div id="new-post-content-div" className="w-full mb-4">
          <Editor
            apiKey={tinymceKey}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>Write your content here!</p>"
            init={{
              height: 350,
              menubar: false,
              plugins: [
                "anchor",
                "autolink",
                "charmap",
                "codesample",
                "emoticons",
                "image",
                "link",
                "lists",
                "media",
                "searchreplace",
                "table",
                "visualblocks",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #f5f5f5; color: #333333; }",
            }}
          />
          {formErrors && (
            <p className="mt-2 text-sm text-gray-500">{formErrors.content}</p>
          )}
        </div>
        <div id="new-post-published" className="mt-4 text-xs">
          <label htmlFor="isPublished" className="block">
            <button
              className="p-2 px-3 mr-2 bg-black text-white rounded-md shadow-md hover:bg-white hover:text-black"
              onClick={() => handleSubmit(true)}
            >
              Publish
            </button>
            <button
              className="p-2 text-gray-600"
              onClick={() => handleSubmit(false)}
            >
              Save as Draft
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}

export default CreateArticles;
