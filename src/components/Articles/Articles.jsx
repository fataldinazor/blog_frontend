import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { formatDate, truncateString } from "@/utils/helper";
import { BlogIcon } from "@/assets/Icons";
import {
  fetchAllPublishedArticlesAPI,
  fetchTopAuthorsAPI,
} from "@/api/articleApi";
import { Loading, LoadingOverlay } from "../Loading";
import toast from "react-hot-toast";

function PaginateBtns({ currPage, setCurrPage, totalPages }) {
  function handleNextBtn() {
    if (currPage < totalPages) {
      setCurrPage(currPage + 1);
    } else {
      console.log(`Last Page Reached!`);
    }
  }

  function handlePrevBtn() {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    } else {
      console.log(`This is the first page`);
    }
  }
  return (
    <div className="flex justify-evenly gap-20 py-5 mx-5 font-semibold text-3xl m-4 ">
      {currPage > 1 && (
        <button
          className="pt-1 pb-2 px-3 md:px-5 bg-black text-white rounded-lg text-center"
          onClick={handlePrevBtn}
        >
          ←
        </button>
      )}
      {currPage < totalPages && (
        <button
          className="pt-1 pb-2 px-3 md:px-5 bg-black text-white rounded-lg"
          onClick={handleNextBtn}
        >
          →
        </button>
      )}
    </div>
  );
}

function ArticleList({ articles, articlesPerPage }) {
  //pagination
  const [currPage, setCurrPage] = useState(1);
  const [articlesOnPage, setArticlesOnPage] = useState([]);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  useEffect(() => {
    setArticlesOnPage(
      articles.slice(
        (currPage - 1) * articlesPerPage,
        currPage * articlesPerPage
      )
    );
    scrollTo(0,0);
  }, [currPage]);

  return (
    <div className="min-w-80 flex flex-col">
      <div className="mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl py-2 md:py-3 lg:py-4 mb-2 font-bold mr-auto">
          Discover Articles
        </h1>
        {articlesOnPage.length ? (
          <div id="article-card-container" className="flex flex-col gap-5">
            {articlesOnPage.map((article) => (
              <div
                id="article-card"
                key={article.id}
                className="max-w-4xl overflow-hidden bg-white rounded-lg shadow-md light:bg-white hover:shadow-xl"
              >
                {article.image_url && (
                  <img
                    className="object-cover w-full h-40 md:h-64 "
                    src={article.image_url}
                    alt="cover-image"
                  />
                )}
                <div className="px-6 py-2">
                  <span className="block float text-xs lg:text-base font-semibold text-gray-500">
                    {article.createdAt === article.updatedAt
                      ? "Pubilshed on: "
                      : "Updated on: "}

                    {formatDate(article.updatedAt)}
                  </span>
                  <div>
                    <Link
                      to={`${article.id}`}
                      className="block text-xl leading-tight md:text-3xl md:leading-snug lg:text-4xl font-bold transition-colors duration-300 transform text-black hover:text-gray-600 hover:underline"
                      tabIndex="0"
                      role="link"
                    >
                      {truncateString(article.title, 125)}
                    </Link>
                  </div>

                  <div className="flex justify-between mt-4 mb-2 ml-1 float">
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full shadow-sm"
                        src={
                          article.user.profile.avatar_url ||
                          "https://res.cloudinary.com/dafr5o0f3/image/upload/v1734374437/x7hjwpduocau04iooenu.png"
                        }
                        alt="Avatar"
                      />
                      <div className="ml-3 flex items-center space-x-2">
                        <div>
                          <p className="text-xs lg:text-sm leading-none font-normal pb-0.5 text-gray-500">
                            Published by
                          </p>
                          <Link
                            to={`/author/${article.user.id}`}
                            className="text-sm md:text-md lg:text-base leading-none font-semibold text-gray-800 hover:underline"
                            tabIndex="0"
                            role="link"
                          >
                            {article.user.username}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <Link to={`/articles/${article.id}`} className="pt-2 pr-1">
                      <BlogIcon height="25" width="25" color="black" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-bold text-3xl md:text-4xl">No Content to show!</p>
        )}
        <PaginateBtns
          currPage={currPage}
          setCurrPage={setCurrPage}
          totalPages={totalPages}
        />
        <p></p>
      </div>
    </div>
  );
}

function TopAuthorList() {
  const [authors, setAuthors] = useState([]);
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTopAuthorsAPI(auth.token);
        if (!result.success) {
          setAuthors(result);
        }else{
          setAuthors(result.authors)
        }
      } catch (error) {
        console.error(`Couldn't Fetch Authors ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    // setIsLoading(true);
    // setTimeout(() => {
    fetchData();
    // }, 4000);
  }, []);

  return (
    <div className="w-full mx-auto max-w-lg p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-black">
          Top Contributers
        </h5>
      </div>
      {isLoading ? (
        <Loading color="black" height="40" width="40" />
      ) : (
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {authors.length ? (
              authors.map((author) => (
                <li key={author?.username} className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={
                          author?.profile?.avatar_url ||
                          "https://res.cloudinary.com/dafr5o0f3/image/upload/v1734374437/x7hjwpduocau04iooenu.png"
                        }
                        alt={author.username || "Author Avatar"}
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <Link to={`/author/${author.id}`}>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {author.fname} {author.lname}
                        </p>
                      </Link>
                      <p className="text-sm text-gray-500 truncate">
                        {author?.username || "No email provided"}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      {author?._count?.posts || 0} Posts
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div>No Authors to Show</div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function Articles() {
  const [articles, setArticles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchAllPublishedArticlesAPI(auth.token);
        if (!result.success) {
          // setArticles(result);
          toast.error(result.msg);
        } else {
          setArticles(result.posts);
        }
      } catch (error) {
        console.log("Failed to fetch artcles", error);
      } finally {
        setIsLoading(false);
      }
    };
    // setIsLoading(true);
    // setTimeout(() => {
      fetchData();
    // }, 3000);
  }, [auth.token]);
  return (
    <div id="full-page" className="bg-slate-100">
      <div
        id="container"
        className="p-4 mx-auto max-w-screen-xl grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-1 "
      >
        <div id="left-container" className="lg:col-span-3">
          {isLoading ? (
            <div className="">
              <LoadingOverlay height="60" width="60" color="black" />
            </div>
          ) : (
            <div>
              {articles.length && (
                <ArticleList articles={articles} articlesPerPage={10} />
              )}
            </div>
          )}
        </div>
        <div id="right-container" className="my-2 lg:my-24">
          <TopAuthorList />
        </div>
      </div>
    </div>
  );
}

export default Articles;
