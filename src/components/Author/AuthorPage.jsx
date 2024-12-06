import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchArticles } from "../../api/authorApi";
import { truncateString, formatDate } from "@/utiils/helper";
import { BlogIcon } from "../../assets/Icons";

function AuthorArticles({ tab }) {
  const { auth } = useAuth();
  const params = useParams();
  const [articles, setArticles] = useState([]);
  const [cachedArticles, setCachedArticles] = useState({
    published: null,
    unpublished: null,
  });

  useEffect(() => {
    let articleType = tab === "published" ? "published" : "unpublished";
    if (cachedArticles[articleType]) {
      setArticles(cachedArticles[articleType]);
    } else {
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
        }
      };
      getArticles();
    }
  }, [tab, params.authorId, auth.token]);

  return (
    <div className="">
      {articles.length ? (
        <div className="bg-white mt-2">
          <div className="min-w-full">
            <h1 className="text-2xl font-bold text-black my-6">
              {tab==="published"?`My Contributions`:`Unpublished Content`}
            </h1>
            <div className="flex flex-col p-2">
              {articles.map((article) => (
                <div key={article.id} className=" bg-white rounded-lg max-w-5xl">
                  <div className="flex font-semibold">
                    <h2 className="text-lg  text-black">{article.title}</h2>
                    <div className=" flex justify-center items-center text-xs px-2 text-gray-500 ml-2 md:ml-4 bg-white border border-slate-700 rounded-3xl my-1 h-5">
                      Public
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
                    <Link className="m-2" to={`/articles/${article.id}`}>
                      <BlogIcon
                        className="self-end"
                        height="20"
                        width="20"
                        color="black"
                      />
                    </Link>
                  </div>
                  <div className="h-px bg-gray-300 my-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="font-bold text-3xl md:text-4xl">No Content to show!</p>
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
            Published Articles
          </Link>
        </li>
        <li>
          <Link
            aria-controls="unpublished articles"
            className={getTabClass("unpublished")}
            to="?tabs=unpublished"
          >
            Unpublished Articles
          </Link>
        </li>
      </ul>
    </div>
  );
}


function AuthorPage() {
  const [searchParams, setSearchParams] = useSearchParams("?tabs=published");
  const tab = searchParams.get("tabs");
  console.log(tab);

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
