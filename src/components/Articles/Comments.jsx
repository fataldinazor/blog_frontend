import { useEffect, useState } from "react";
import { fetchComments, postUserComment } from "../../api/articleApi";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

function Comments() {
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload]= useState();
  const [isDropDownOpen, setIsDropDown] = useState({});
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchComments(auth.token, params.articleId);
        setComments(result);

      } catch (error) {
        console.log("Error from backend", error);
      }
    };
    fetchData();
    console.log(comments);
    setLoading(false);
    setReload(false)
  }, [params.articleId, reload]);

  async function handleSubmit(event) {
    event.preventDefault();
    setUserComment("");
    const result=await postUserComment(auth.token, params.articleId, userComment);
    console.log(result);
    setLoading(true);
    setReload(true);
  }

  const toggleDropDown = (commentId) => {
    setIsDropDown((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="outline-dotted outline-red-500">
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              {`Discussion(${comments.length})`}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="6"
                value={userComment}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                onChange={(e) => setUserComment(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Post comment
            </button>
          </form>

          {comments.length ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                        alt={comment.user.username}
                      />
                      {comment.user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(comment.updatedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <button
                      id={`dropdownCommentButton-${comment.id}`}
                      data-dropdown-toggle="dropdownComment1"
                      className={`inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
                      type="button"
                      onClick={() => toggleDropDown(comment.id)}
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 3"
                      >
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                      </svg>
                      <span className="sr-only">Comment settings</span>
                    </button>
                    <div
                      id={`dropdownCommentButton-${comment.id}`}
                      className={`z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 ${
                        isDropDownOpen[comment.id] ? "block" : "hidden"
                      }`}
                    >
                      <ul
                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconHorizontalButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Remove
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </footer>
                <p className="text-gray-500 dark:text-gray-400">
                  {comment.text}
                </p>
              </article>
            ))
          ) : (
            <div className="text-white">Be the First one to Comment</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Comments;
