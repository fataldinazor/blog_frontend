import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleWithId, updateArticleWithId } from "../../api/articleApi";
import AuthorizeError from "../Error/AuthorizeError";
import { Editor } from "@tinymce/tinymce-react";
import config from "../../config";
import { Triangle } from "react-loader-spinner";
import { TrashIcon, ModifyIcon } from "../../assets/Icons";
import { uploadToCloudinary } from "../../api/articleApi";

function UpdateArticles() {
  const { auth } = useAuth();
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState();
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [formValues, setFormValues] = useState({
    image_url: "",
    title: "",
    content: "",
    isPublished: true,
  });
  const [image, setImage] = useState({
    file: null,
    imagePreview: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageErrors, setImageErrors] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isImageDirty, setIsImageDirty] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const imageInputRef = useRef(null);
  const editorRef = useRef();
  const { tinymceKey } = config;
  const navigate = useNavigate();

  //fetching data on mount
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const result = await fetchArticleWithId(auth.token, params.articleId);
        if (result.user.id !== auth.userInfo.id) {
          setIsLoading(false);
          setIsAuthorized(false);
          return;
        }
        console.log(result);
        setArticle(result);
        setFormValues((prevValues) => ({
          ...prevValues,
          image_url: result?.image_url || null,
          title: result.title,
          content: result.content,
        }));
        setImage((prevValues) => ({
          ...prevValues,
          imagePreview: result?.image_url || null,
        }));
        // console.log(formValues);
      } catch (error) {
        console.log(`Error occured ${error}`);
      }
    };
    fetchData();

    setIsLoading(false);
  }, [params.authorId, auth.token]);

  // useEffect(() => console.log(editorRef.current), [editorRef.current]);
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setIsLoading(true);
      handleFormValuesForUpdation();
    }
  }, [formErrors, isSubmit]);

  async function handleFormValuesForUpdation() {
    setIsSubmit(false);
    let updatedFormValues = { ...formValues };
    //if nothing has changed
    if (isImageDirty === false && isFormDirty === false) {
      navigate(`/articles/${params.articleId}`);
      return;
    }

    //if image is modified
    if (isImageDirty) {
      //if file exists
      if (image.file) {
        try {
          const uploadedImageUrl = await uploadToCloudinary(image.file);
          updatedFormValues = {
            ...updatedFormValues,
            image_url: uploadedImageUrl,
            old_image_url: article.image_url || null,
          };
        } catch {
          console.log("Upload to Cloudinary Failed");
        }
      } else {
        updatedFormValues = {
          ...updatedFormValues,
          image_url: null,
          old_image_url: article.image_url || null,
        };
      }
    } else {
      updatedFormValues = { ...updatedFormValues, old_image_url: null };
    }
    await updateArticleWithId(auth.token, params.articleId, updatedFormValues);
    navigate(`/articles/${params.articleId}`);
  }

  // TEXT DATA FROM HERE
  //handle any change in text data
  function handleChange(event) {
    const { value, name } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setIsFormDirty(true);
  }

  //submitting the articles
  async function handleSubmit(bool) {
    let content = editorRef.current.getContent();
    let title = formValues.title;
    title = title.trim();

    const boolChanged = bool !== article.published;
    const contentChanged = content !== article.content;
    if (boolChanged || contentChanged) {
      setIsFormDirty(true);
    }

    setIsSubmit(true);
    setFormValues({
      ...formValues,
      content: content,
      title: title,
      isPublished: bool,
    });
    setFormErrors(validateTextData(formValues));
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
    return errors;
  }

  // IMAGE FROM HERE
  //handling image selection
  function handleImageSelection(event) {
    setIsImageDirty(true);
    const file = event.target.files[0];
    const validationResult = imageValidation(file);
    if (!validationResult) {
      event.target.value = null;
    } else {
      const blobUrl = URL.createObjectURL(file);
      setImage({ file: event.target.files[0], imagePreview: blobUrl });
    }
  }

  //image validation and setup in state
  function imageValidation(file) {
    const acceptedFileTypes = ["image/jpg", "image/png", "image/jpeg"];
    const defaultImagePreview = article?.image_url || null;
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

  // handle changing the avatar
  function handleChangeImage() {
    setImage({ file: null, imagePreview: article?.image_url || null });
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
      imageInputRef.current.click();
    }
  }

  // handling the removal of avatar image
  function handleRemoveImage() {
    imageInputRef.current.value = null;
    setImage({ file: null, imagePreview: null });
    setIsImageDirty(true);
    // setIsFormDirty(true);
  }

  if (!isAuthorized) {
    return <AuthorizeError />;
  }

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="flex justify-center min-w-fit">
      <div id="new-post-inputs" className="text-black p-6 rounded-md">
        <div id="new-post-image-btn" className="mb-4">
          <div>
            {!image.imagePreview ? (
              <label
                htmlFor="image_url"
                className="flex flex-col items-start justify-start text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <div className="h-24 w-36 rounded-lg bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Insert Image</span>
                </div>
                {imageErrors && (
                  <p className=" mt-1 text-xs text-wrap text-center">
                    {imageErrors}
                  </p>
                )}
              </label>
            ) : (
              <div className="h-full flex flex-col justify-start items-start md:flex-row md:items-center md:gap-3 ">
                <img
                  src={image.imagePreview}
                  alt="cover-image-preview"
                  className="h-24 w-36 object-cover rounded-lg"
                />
                {imageErrors && (
                  <p className=" mt-1 text-xs text-wrap text-center">
                    {imageErrors}
                  </p>
                )}
                <div className="flex items-center justify-center mt-4 gap-3">
                  <button type="button" onClick={handleChangeImage}>
                    <ModifyIcon height="23" width="25" />
                  </button>
                  <button type="button" onClick={handleRemoveImage}>
                    <TrashIcon height="25" width="25" />
                  </button>
                </div>
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              id="image_url"
              name="image_url"
              accept=".jpg, .png, .jpeg"
              className="hidden"
              onChange={handleImageSelection}
            />
          </div>
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
            value={formValues.title || ""}
            rows={2}
            cols={35}
            className="text-xl md:text-3xl font-bold w-full min-h-10 max-h-96 overflow-x-hidden overflow-y-auto bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          ></textarea>
          {formErrors.title && (
            <p className="mt-2 text-sm text-gray-500">{formErrors.title}</p>
          )}
        </div>
        <div id="new-post-content-div" className="w-full mb-4">
          <Editor
            apiKey={tinymceKey}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={`${formValues.content}`}
            init={{
              height: 300,
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
        <div id="new-post-published" className="mt-4 text-xs md:font-semibold">
          <label htmlFor="isPublished" className="block">
            <button
              className="p-2 px-3 mr-2  bg-black border border-black text-white rounded-md shadow-md hover:bg-white hover:text-black"
              onClick={() => handleSubmit(true)}
            >
              Update
            </button>
            <button
              className="p-2 text-gray-600"
              onClick={() => handleSubmit(false)}
            >
              Make this a Draft
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}

export default UpdateArticles;
