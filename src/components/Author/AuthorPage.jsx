import { useState, useEffect } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchArticles } from "@/api/authorApi";
import { truncateString, formatDate } from "@/utils/helper";
import { BlogIcon, ModifyIcon, OptionIcon } from "@/assets/Icons";
import { Triangle } from "react-loader-spinner";
import ArticleId from "../Articles/ArticleId";

function AuthorArticles({ tab }) {
  const { auth } = useAuth();
  const params = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedArticles, setCachedArticles] = useState({
    published: null,
    unpublished: null,
  });
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    let articleType = tab === "published" ? "published" : "unpublished";
    if (cachedArticles[articleType]) {
      setArticles(cachedArticles[articleType]);
    } else {
      setIsLoading(true);
      const getArticles = async () => {
        try {
          const result = await fetchArticles(
            articleType,
            auth.token,
            params.authorId
          );
          if (result) {
            setCachedArticles((prevCache) => ({
              ...prevCache,
              [articleType]: result,
            }));
            setArticles(result);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        } finally {
          setIsLoading(false);
        }
      };
      setTimeout(() => {
        getArticles();
      }, 2000);
    }
  }, [tab, params.authorId, auth.token]);

  if (isLoading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <Triangle
          visible={true}
          height="40"
          width="40"
          color="#000000"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }

  return (
    <div className="">
      {articles.length ? (
        <div className="bg-white mt-2">
          <div className="min-w-full">
            <h1 className="text-2xl font-bold text-black my-6">
              {tab === "published" ? `My Contributions` : `Unpublished Content`}
            </h1>
            <div className="flex flex-col p-2">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className=" bg-white rounded-lg max-w-5xl"
                >
                  <div className="flex justify-between font-semibold">
                    <div className="flex">
                      <h2 className="text-lg text-black">
                        {truncateString(article.title, 50)}
                      </h2>
                      <div className=" flex justify-center items-center text-xs px-2 text-gray-500 ml-2 md:ml-4 bg-white border border-slate-700 rounded-3xl my-1 h-5">
                        {article.published ? "Public" : "Private"}
                      </div>
                    </div>
                    <div className="self-start ml-5 mb-2 relative">
                      {article.user.id===auth.userInfo.id && <button
                        onClick={() =>
                          setShowOptions(
                            showOptions === article.id ? null : article.id
                          )
                        }
                      >
                        <OptionIcon height="12" width="12" />
                      </button>}
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
                  </div>
                  <p className="text-sm text-gray-700">{article.description}</p>
                  <div className="flex justify-between gap-2">
                    <div className="flex justify-start mt-4 gap-2">
                      <span className="hidden md:block flex items-center text-sm text-gray-800">
                        {article.user.username}
                        <span> I </span>
                      </span>
                      <span className="hidden md:block text-sm text-gray-500">
                        Published on
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
      ) : (
        <div className="font-semibold flex min-h-80 text-gray-500 justify-center items-center text-xl md:text-2xl">
          No Contributions yet!
        </div>
      )}
    </div>
  );
}

function AuthorNav({ tab }) {
  const [activeTab, setActiveTab] = useState(tab);

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
        <li>
          <Link
            aria-controls="unpublished articles"
            className={getTabClass("unpublished")}
            to="?tabs=unpublished"
          >
            Drafts
          </Link>
        </li>
      </ul>
    </div>
  );
}

function AuthorPage() {
  const [searchParams, setSearchParams] = useSearchParams("?tabs=published");
  const tab = searchParams.get("tabs");
  // console.log(tab);

  return (
    <div className="flex flex-col w-full min-w-80 mb-6 break-words rounded-2xl">
      <div className="border mb-2 mx-5"></div>
      <div className="px-2 flex-auto max-w-5xl mx-auto min-h-[70px] pb-0 bg-transparent">
        <AuthorNav
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          tab={tab}
        />
        <AuthorArticles tab={tab} searchParams={searchParams} />
      </div>
    </div>
  );
}

export default AuthorPage;
