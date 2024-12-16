import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAuthorArticlesAPI,
  fetchBookmarkedPostsAPI,
} from "@/api/authorApi";
import { formatDate } from "@/utils/helper";
import { BlogIcon, OptionIcon } from "@/assets/Icons";
// import { Triangle } from "react-loader-spinner";
import { Loading } from "../Loading";
import NotAuthorized from "../Error/AuthorizeError";
import toast from "react-hot-toast";

function ShowBtn({ article, setShowOptions, showOptions }) {
  return (
    <div className="self-start ml-5 mb-2 relative">
      <button
        onClick={() =>
          setShowOptions(showOptions === article.id ? null : article.id)
        }
      >
        <OptionIcon height="12" width="12" />
      </button>
      {showOptions === article.id && (
        <div className="block flex flex-col bg-gray-100 shadow-md rounded-md absolute right-0">
          <Link
            to={`/articles/${article.id}/update`}
            className="text-sm py-2 px-4  md:text-base text-left rounded-md hover:bg-gray-200"
          >
            Edit
          </Link>
          <Link
            to={`/articles/${article.id}/update`}
            className="text-sm py-2 px-4 md:text-base text-left rounded-md hover:bg-gray-200"
          >
            Delete
          </Link>
        </div>
      )}
    </div>
  );
}

function DislpayArticles({ articles, tab }) {
  const [showOptions, setShowOptions] = useState(false);
  const { auth } = useAuth();
  return (
    <div className="articles-list">
      <div className="bg-white mt-2">
        <div className="min-w-full">
          <h1 className="text-xl md:text-2xl ml-2 font-bold text-black my-2 pt-3">
            {tab === "published"
              ? `Contributions`
              : tab === "unpublished"
              ? `Drafts`
              : `Bookmarks`}
          </h1>
          <div className="flex flex-col p-2">
            {articles.map((article) => (
              <div key={article.id} className=" bg-white rounded-lg max-w-5xl">
                <div className="flex justify-between font-semibold">
                  <div className="flex">
                    <h2 className="text-lg text-black leading-tight tuncate md:leading-normal">
                      {article.title}
                    </h2>
                    <div className=" flex justify-center items-center text-xs px-2 text-gray-500 ml-2 md:ml-4 bg-white border border-slate-700 rounded-3xl my-1 h-5">
                      {article.published ? "Public" : "Private"}
                    </div>
                  </div>
                  <div className="self-start ml-5 mb-2 relative">
                    {article?.user.id === auth.userInfo.id && (
                      <ShowBtn
                        article={article}
                        setShowOptions={setShowOptions}
                        showOptions={showOptions}
                      />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{article.description}</p>
                <div className="flex justify-between gap-2">
                  <div className="flex justify-start mt-4 gap-2">
                    <span className="hidden md:block flex items-center text-sm text-gray-800">
                      {article?.user.username}
                      <span> I </span>
                    </span>
                    <span className="hidden md:block text-sm text-gray-500">
                      {/* {Published on} */}
                      {article.createdAt === article.updatedAt
                        ? "Published on"
                        : "Updated on"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(article.updatedAt)}
                    </span>
                  </div>
                  <div className="flex self-end mr-2 mt-2">
                    <Link to={`/articles/${article.id}`}>
                      <BlogIcon height="20" width="20" color="black" />
                    </Link>
                  </div>
                </div>
                <div className="h-px bg-gray-300 my-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthorArticles({ tab }) {
  const { auth } = useAuth();
  const params = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedArticles, setCachedArticles] = useState({
    published: null,
    unpublished: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      let cacheKey;
      let fetchFunction;

      if (tab === "published") {
        fetchFunction = () =>
          fetchAuthorArticlesAPI("published", auth.token, params.authorId);
        cacheKey = "published";
      } else if (tab === "unpublished") {
        if (auth.userInfo.id !== parseInt(params.authorId)) {
          setIsLoading(false);
          return;
        }
        fetchFunction = () =>
          fetchAuthorArticlesAPI("unpublished", auth.token, params.authorId);
        cacheKey = "unpublished";
      } else if (tab === "bookmarks") {
        if (auth.userInfo.id !== parseInt(params.authorId)) {
          setIsLoading(false);
          return;
        }
        fetchFunction = () =>
          fetchBookmarkedPostsAPI(auth.token, params.authorId);
        cacheKey = "bookmarks";
      }

      if (cachedArticles[cacheKey]) {
        setArticles(cachedArticles[cacheKey]);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        try {
          const result = await fetchFunction();
          // console.log(result.posts);
          if (result.networkError) {
            toast.error(result.msg);
            return;
          }
          if (result.success) {
            setArticles(result.posts);
            setCachedArticles((prevValue) => ({
              ...prevValue,
              [cacheKey]: result.posts,
            }));
          } else {
            toast.error(`Failed to fetch ${tab} data`);
          }
        } catch (error) {
          console.error(`Error occured ${tab} data`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    // setIsLoading(true);
    // setTimeout(() => {
      fetchData();
    // }, 2000);
  }, [tab, params.authorId, auth.token, cachedArticles]);

  if (isLoading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <Loading color="black" height="40" width="40" />
      </div>
    );
  }

  if (tab === "unpublished" && auth.userInfo.id !== parseInt(params.authorId)) {
    return <NotAuthorized />;
  }

  return articles && articles.length ? (
    <DislpayArticles articles={articles} tab={tab} />
  ) : (
    <div className="font-semibold flex min-h-80 text-gray-500 justify-center items-center text-xl md:text-2xl">
      No Contributions yet!
    </div>
  );
}

function AuthorNav({ tab }) {
  const [activeTab, setActiveTab] = useState(tab);
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const getTabClass = (currentTab) =>
    `py-3 px-4 rounded-t-md text-base font-semibold ${
      activeTab === currentTab
        ? "text-primary border-b-2 border-primary"
        : "text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary"
    } transition-all duration-300`;

  return (
    <div className="my-4">
      <ul className="flex justify-center gap-2 text-base">
        <li>
          <Link
            aria-controls="published articles"
            className={getTabClass("published")}
            to="?tabs=published"
          >
            Published
            <span className="hidden md:inline-block ml-1">Articles</span>
          </Link>
        </li>
        {auth.userInfo.id === parseInt(params.authorId) && (
          <>
            <li>
              <Link
                aria-controls="unpublished articles"
                className={getTabClass("unpublished")}
                to="?tabs=unpublished"
              >
                Drafts
              </Link>
            </li>
            <li>
              <Link
                to="?tabs=bookmarks"
                aria-controls="bookmarked articles"
                className={getTabClass("bookmarks")}
              >
                Bookmarks
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

function AuthorPage() {
  const [searchParams, setSearchParams] = useSearchParams("?tabs=published");
  const tab = searchParams.get("tabs");

  return (
    <div className="flex flex-col w-full min-w-80 mb-6 break-words rounded-2xl">
      <div className="border mb-2 mx-5"></div>
      <div className="px-2 flex-auto max-w-5xl mx-auto min-h-[70px] pb-0 bg-transparent">
        <AuthorNav
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          tab={tab}
        />
        <AuthorArticles tab={tab} />
      </div>
    </div>
  );
}

export default AuthorPage;
