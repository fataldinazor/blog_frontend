import { useEffect, useState } from "react";
import { fetchCommentsAPI, postUserCommentAPI } from "@/api/articleApi";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/helper";
import toast from "react-hot-toast";
import { Loading } from "../Loading";

function Comments({ comments, setComments }) {
  const [userComment, setUserComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchCommentsAPI(auth.token, params.articleId);
        if (!result.success) {
          toast.error(result.msg);
        } else {
          setComments(result.comments);
        }
      } catch (error) {
        console.log("Error fetching comments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.articleId]);

  //trying to use optimistic UI here
  async function handleSubmit(event) {
    event.preventDefault();
    const commentText = userComment;
    setUserComment("");
    const tempCommentId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;
    const tempComment = {
      id: tempCommentId,
      text: commentText,
      updatedAt: new Date().toISOString(),
      user: {
        username: auth.userInfo.username,
        role: auth.userInfo.role,
      },
    };
    setComments([...comments, tempComment]);
    try {
      const result = await postUserCommentAPI(
        auth.token,
        params.articleId,
        commentText
      );
      if (!result.success) {
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== tempCommentId)
        );
        toast.error(result.msg);
      }
    } catch (error) {
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== tempCommentId)
      );
      console.error("Failed to make request! ", error);
    }
  }

  return (
    <div className="px-10 lg:mb-16">
      <section className="bg-white py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{`Discussions (${
              comments.length || 0
            })`}</h2>
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
          {isLoading ? (
            <div className="w-full border border-gray-200 rounded">
              <Loading color="black" height={50} width={50} />
            </div>
          ) : comments.length ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="p-4 mb-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full mr-3"
                      src={
                        "https://res.cloudinary.com/dafr5o0f3/image/upload/v1734374437/x7hjwpduocau04iooenu.png"
                      }
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
