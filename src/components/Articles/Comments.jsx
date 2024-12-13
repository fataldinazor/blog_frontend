import { useEffect, useState } from "react";
import { fetchComments, postUserComment } from "../../api/articleApi";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/helper";

function Comments({comments, setComments}) {
  // const [comments, setComments] = useState({});
  const [userComment, setUserComment] = useState("");
  const [reload, setReload] = useState();
  const { auth } = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [isDropDownOpen, setIsDropDown] = useState({});

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
    setLoading(false);
    setReload(false);
  }, [params.articleId, reload]);

  async function handleSubmit(event) {
    event.preventDefault();
    setUserComment("");
    const result = await postUserComment(
      auth.token,
      params.articleId,
      userComment
    );
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
    <div className="px-10 lg:mb-16">
      <section className="bg-white py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{`Discussions (${comments.length})`}</h2>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="py-3 px-4 bg-gray-50 rounded-lg border border-gray-300">
              <textarea
                id="comment"
                rows="4"
                value={userComment}
                className="w-full text-sm text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none"
                placeholder="Add to the discussion"
                onChange={(e) => setUserComment(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-3 py-2 px-4 text-sm font-medium text-white bg-black border border-white hover:bg-white hover:text-black hover:border hover:border-gray-500 focus:ring-4 focus:ring-blue-200 rounded-lg"
            >
              Post comment
            </button>
          </form>

          {comments.length ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="p-4 mb-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full mr-3"
                      src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                      alt={comment.user.username}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.updatedAt)}
                      </p>
                    </div>
                  </div>
                  {/* <div>
                    <button
                      className="inline-flex items-center p-2 text-sm text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300"
                      onClick={() => toggleDropDown(comment.id)}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                      </svg>
                    </button>
                  </div> */}
                </footer>
                <p className="text-gray-700">{comment.text}</p>
              </article>
            ))
          ) : (
            <div className="text-gray-700 text-xl font-semibold">
              Be the one to start a Discussion
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Comments;
