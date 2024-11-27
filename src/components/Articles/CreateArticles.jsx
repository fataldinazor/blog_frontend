import { useEffect, useState, useRef} from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageErrors, setImageErrors] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate=useNavigate();
  const {apiUrl, cloudName, presetName}=config;
  
  //checks for clearing of the errors in form before sending the data to backend
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleBlogValues(image);
    }
  }, [formErrors]);
  
  //handle blog values after submit and before going to backend 
  async function handleBlogValues(image){
    let uploadedImageUrl=null;
    if(image){
      try {
        uploadedImageUrl=await uploadToCloudinary(image);
        setFormValues({...formValues, imageUrl: uploadedImageUrl});
      } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        return;
      }
    }
    sendValtoBackend({...formValues, imageUrl: uploadedImageUrl});
  }

  // uploading image to Cloudinary and generating a link to store in imageUrl 
  async function uploadToCloudinary(image){
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    try {
      const formData= new FormData();
      formData.append("file", image);
      formData.append("upload_preset", presetName);
      formData.append("tags", "cover-image");
      const response = await fetch(CLOUDINARY_URL, {method:"POST", body:formData});
      const result = await response.json(); 
      return result.secure_url;
    } catch (error) {
      console.error("Error occured while uploading to cloudinary", error);
      return null;
    }
  }

  // sending values to backend
  async function sendValtoBackend(formValues) {
    try {
      const url=`${apiUrl}posts/`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formValues),
      });
      const result=await response.json();
      console.log(result);
      navigate("/articles");
    } catch (error) {
      console.error("Problem with the backend", error)
    }
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
      setImageErrors("The file size is over 3MB, Reduce it");
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
    // console.log(event.target.files[0]);
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

  return (
    <div id="new-post-inputs">
      <div id="new-post-image-btn">
        {!imagePreview ? (
          <>
            <input
              type="file"
              id="coverImage"
              name="image"
              accept=".jpg, .png, .jpeg"
              onChange={handleImageSelection}
            />
            {imageErrors && <p>{imageErrors}</p>}
          </>
        ) : (
          <div className="flex">
            <img src={imagePreview} alt="cover-image" className="h-36" />
            <button onClick={handleRemoveClick}>Remove</button>
          </div>
        )}
      </div>
      <div id="new-post-title-div">
        <label htmlFor="new-post-title">
          <textarea
            type="text"
            id="new-post-title"
            name="title"
            onChange={handleChange}
            rows={2}
            cols={35}
            className="text-4xl font-bold w-4/6 min-h-10 max-h-96 overflow-x-hidden overflow-y-auto"
          ></textarea>
        </label>
        {formErrors.title && <p>{formErrors.title}</p>}
      </div>
      <div id="new-post-content-div" className="w-4/6">
        <Editor
          apiKey="hmw1o8dg0ayzsl22wh5okr67lsf9j4ro70rfmgh7k5xcsnwu"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
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
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        {formErrors && <p>{formErrors.content}</p>}
      </div>
      <div id="new-post-published">
        <label htmlFor="isPublished">
          <button className="p-2 mr-2" onClick={() => handleSubmit(true)}>
            Publish
          </button>
          <button className="p-2 ml-2" onClick={() => handleSubmit(false)}>
            Save as Draft
          </button>
        </label>
      </div>
    </div>
  );
}

export default CreateArticles;
