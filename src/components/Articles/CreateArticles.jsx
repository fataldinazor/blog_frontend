import { useEffect, useState, useRef, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../context/AuthContext";

function CreateArticles() {
  const { auth } = useAuth();
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    isPublished: true,
  });
  const editorRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageErrors, setImageErrors] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    console.log(formValues, image, imagePreview);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      sendValtoBackend(formValues, image);
    }
  }, []);

  function validateTextData({title}) {
    console.log("Im here");
    let errors={}
    const wordcount=editorRef.current.plugins.wordcount.body.getWordCount();

    if(title.length<10){
      errors.title="The Title should have at least 15 Characters!"
    }else if(title.length>300){
      errors.title="The title should have less than 300 Characters!"
    }

    if(wordcount<100){
      errors.content="There should be atleast 50 words in you blog content!"
    }else if(wordcount>3000){
      errors.content="There should less than 3000 words in your blog content!"
    }
    console.log(errors);
    setFormErrors(errors);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // setFormErrors(validate(formValues, selectedImage));
  }

  //image validation and setup
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
  function handleImageSelection(event) {
    console.log(event.target.files[0]);
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

  function handleRemoveClick() {
    setImage("");
    setImagePreview("");
  }



  function handlePublish() {
    let content =editorRef.current.getContent();
    let title =formValues.title;
    title=title.trim();    
    setIsSubmit(true);
    setFormValues({...formValues, content: content, title:title});
    setFormErrors(validateTextData(formValues));
  }

  function handleDraft() {
    setFormValues({...formValues, isPublished:false});
    handlePublish();
  }

  return (
    <div id="new-post-form">
      <form onSubmit={handleSubmit}>
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
              <img src={imagePreview} alt="cover-image" className="h-48" />
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
              className="text-4xl font-bold w-200 min-h-10 max-h-96 overflow-x-hidden overflow-y-auto"
            ></textarea>
          </label>
          {formErrors && <p>{formErrors.title}</p>}
        </div>
        <div id="new-post-content-div" className="">
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
            <button onClick={handlePublish}>Publish</button>
            <button onClick={handleDraft}>Save as Draft</button>
          </label>
        </div>
      </form>
    </div>
  );
}

export default CreateArticles;
