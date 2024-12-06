import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { EmailIcon, LocationIcon } from "../../assets/Icons";
import { fetchAuthorDetails } from "../../api/authorApi";
import { useAuth } from "../../context/AuthContext";

function AuthorInfo() {
  const [author, setAuthor] = useState({});
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAuthorDetails(auth.token, params.authorId);
        if (result) {
          setAuthor(result);
        }
      } catch (error) {
        console.log("Error" + error);
      }
    };
    fetchData();
    console.log(author);
  }, [params.authorId, auth.token]);

  return Object.keys(author).length ? (
    <div
      id="author-info"
      className="max-w-3xl min-w-96 mx-auto px-2 py-4 grid grid-cols-4"
    >
      <div className="flex items-center col-span-1">
        <img
          src={author.image_url || "https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/avatars/avatar1.jpg"}
          alt="author-avatar"
          className="rounded-2xl max-h-40"
        />
      </div>
      <div className="col-span-3 flex flex-col px-2">
        <div
          id="author-name"
          className="text-xl font-semibold flex md:text-2xl"
        >
          {author.fname} {author.lname}
          <div className=" flex justify-center items-center text-xs px-2 text-gray-500 ml-2 md:ml-4 bg-white border border-slate-700 rounded-3xl my-auto h-6">
            {author.role}
          </div>
        </div>
        <div
          id="author-username"
          className="text-sm text-gray-500 font-semibold md:text-sm"
        >
          @{author.username}
        </div>
        <div id="author-bio" className="text-xs py-1 md:text-sm  ">
          {author.profile.bio}
        </div>

        <div className="flex flex-wrap justify-between pt-2">
          <div className="flex flex-wrap items-center text-xs md:text-sm">
            <div className="mr-3 mb-2 inline-flex items-center justify-center h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1  font-medium leading-normal">
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
    <h2>Failed to fetch the profile</h2>
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
