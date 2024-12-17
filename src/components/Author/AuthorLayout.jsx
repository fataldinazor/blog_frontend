import { useState, useEffect, lazy, Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import { ModifyIcon } from "@/assets/Icons";
import { fetchAuthorDetailsAPI } from "@/api/authorApi";
import { useAuth } from "@/context/AuthContext";
import { Loading, LoadingOverlay } from "../Loading";
import toast from "react-hot-toast";
// import UpdateAuthor from "./UpdateAuthor";
const UpdateAuthor = lazy(() => import("./UpdateAuthor"));

function AuthorInfo() {
  const [author, setAuthor] = useState(null);
  const { auth } = useAuth();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState(null);

  //fetching when author is null (initially and after updation)
  useEffect(() => {
    if (author === null && !isLoading) {
      const fetchData = async () => {
        setError(null);
        setIsLoading(true);
        try {
          const result = await fetchAuthorDetailsAPI(
            auth.token,
            params.authorId
          );
          if (result.networkError) {
            toast.error(result.msg);
            setIsLoading(false);
            setError(result.msg);
            return;
          }
          if (!result.success) {
            toast.error(result.msg);
            setIsLoading(false);
            setError(result.msg);
          } else {
            setAuthor(result.authorInfo);
          }
        } catch (error) {
          setError("Error occured fetching author details");
          console.log("Error" + error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [author, params.authorId, auth.token]);

  if (isLoading) {
    return (
      <div className="h-48">
        <Loading width="50" height="50" color="black" />
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="h-48 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  {
    return author ? (
      <div
        id="author-info"
        className="max-w-3xl min-w-96 mx-auto px-2 py-4 grid grid-cols-4"
      >
        {showEdit && (
          <Suspense fallback={<LoadingOverlay/>}>
            <UpdateAuthor
              setAuthor={setAuthor}
              author={author}
              showEdit={showEdit}
              setShowEdit={setShowEdit}
            />
          </Suspense>
        )}
        <div className="flex items-start md:items-center col-span-1">
          <img
            src={
              author?.profile?.avatar_url ||
              "https://res.cloudinary.com/dafr5o0f3/image/upload/v1734374702/kuj0fdxzre658wjlfksb.webp"
            }
            alt="author-avatar"
            className="rounded-2xl max-h-40"
          />
        </div>
        <div className="col-span-3 flex flex-col px-2 ml-2 lg:ml-3">
          <div className="flex justify-between">
            <div
              id="author-name"
              className="text-lg font-semibold flex md:text-2xl"
            >
              {author?.fname} {author?.lname}
              <div className=" flex justify-center items-center text-xs px-2 text-gray-500 ml-2 md:ml-4 bg-white border border-slate-700 rounded-3xl my-auto h-6">
                {author?.role}
              </div>
            </div>
            {author?.id === auth.userInfo.id && (
              <div id="edit-profile">
                <button onClick={() => setShowEdit(true)}>
                  <ModifyIcon height="25" width="25" />
                </button>
              </div>
            )}
          </div>
          <div
            id="author-username"
            className="text-sm text-gray-500 font-semibold md:text-sm"
          >
            @{author?.username || "username"}
          </div>
          <div id="author-bio" className="text-xs py-1 md:text-sm px-1">
            {author?.profile?.bio || ""}
          </div>

          <div className="flex flex-wrap justify-between pt-2">
            <div className="flex flex-wrap items-center text-xs md:text-sm">
              <div className="mr-3 mb-2 inline-flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 font-medium leading-normal">
                {author?._count?.posts || 0} Contributions
              </div>
              <div className="mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 font-medium leading-normal">
                {author?._count?.comments || 0} Comments
              </div>
              <div className="mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 font-medium leading-normal">
                {author?._count?.likes || 0} Likes
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="h-24 flex justify-center items-center">
        Failed to fetch author Information
      </div>
    );
  }
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
