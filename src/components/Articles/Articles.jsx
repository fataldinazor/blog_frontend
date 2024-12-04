import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { truncateString } from "../../utiils/helper";
import ahead from "../../assets/ahead.svg";
import {
  fetchAllPublishedArticles,
  fetchTopAuthors,
} from "../../api/articleApi";

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
    <div className="flex justify-evenly gap-20 py-5 mx-5 font-semibold text-3xl ">
      {currPage>1 &&<button className="pt-1 pb-2 px-3 md:px-5 bg-black text-white rounded-lg text-center" onClick={handlePrevBtn}>←</button>}
      {currPage<totalPages && <button className="pt-1 pb-2 px-3 md:px-5 bg-black text-white rounded-lg" onClick={handleNextBtn}>→</button>}
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
    // scrollTo(0,0);
  }, [currPage]);

  return (
    <div className="min-w-96 flex flex-col m-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl py-2 md:py-3 lg:py-4 mb-2 font-bold ">
        Discover Articles
      </h1>
      {articlesOnPage.length > 0 ? (
        <div id="article-card-container" className="flex flex-col gap-5">
          {articlesOnPage.map((article) => (
            <div
              id="article-card"
              key={article.id}
              className="max-w-4xl overflow-hidden bg-white rounded-lg shadow-md light:bg-white hover:shadow-xl"
            >
              {article.image_url && (
                <img
                  className="object-cover w-full h-64"
                  src={article.image_url}
                  alt="cover-image"
                />
              )}
              <div className="px-6 py-2">
                <span className="block float text-sm lg:text-base font-semibold text-gray-500">
                  Pubilshed:{" "}
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div>
                  <Link
                    to={`${article.id}`}
                    className="block text-2xl md:text-3xl lg:text-4xl font-bold transition-colors duration-300 transform text-black hover:text-gray-600 hover:underline"
                    tabIndex="0"
                    role="link"
                  >
                    {article.title}
                  </Link>
                  <p
                    className="mt-2  text-sm text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{
                      __html: truncateString(article.content, 175),
                    }}
                  ></p>
                </div>

                <div className="flex justify-between mt-4 mb-2 ml-1 float">
                  <div className="flex items-center">
                    {/* Avatar */}
                    <img
                      className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full shadow-sm"
                      src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                      alt="Avatar"
                    />

                    {/* User Info */}
                    <div className="ml-3 flex items-center space-x-2">
                      <div>
                        <p className="text-xs lg:text-sm leading-none font-normal pb-0.5 text-gray-500">
                          Published by
                        </p>
                        <a
                          href="#"
                          className="text-md md:text-md lg:text-lg leading-none font-semibold text-gray-800 hover:underline"
                          tabIndex="0"
                          role="link"
                        >
                          {article.user.username}
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to={`/articles/${article.id}`}>
                    <img
                      src={ahead}
                      role="link"
                      className="pr-2 w-8 cursor-pointer"
                    />
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
    </div>
  );
}

function TopAuthorList() {
  const [authors, setAuthors] = useState();
  const { auth } = useAuth();
  useState(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTopAuthors(auth.token);
        console.log(result);
        if (result) {
          setAuthors(result);
        }
      } catch (error) {
        console.error(`Couldn't Fetch Authors ${error}`);
      }
    };
    fetchData();
  });
  return (
    <div className="w-full max-w-md p-4 rounded-lg  sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-black">
          Top Contributers
        </h5>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {authors &&
            authors.map((author) => (
              <li key={author.username} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        author.profile?.avatar_url ||
                        "https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                      }
                      alt={author.username || "Author Avatar"}
                    />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {author.fname} {author.lname}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {author.username || "No email provided"}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold ">
                    {author._count?.posts || 0} Posts
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

function Articles() {
  const [articles, setArticles] = useState({});
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAllPublishedArticles(auth.token);
        setArticles(result);
      } catch (error) {
        console.log("Failed to fetch artcles", error);
      }
    };
    fetchData();
  }, [auth.token]);

  return (
    <div id="full-page" className="bg-slate-100">
      <div
        id="container"
        className="lg:mx-40 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 "
      >
        <div id="left-container" className="lg:col-span-3">
          {articles.length && <ArticleList articles={articles} articlesPerPage={10} />}
        </div>
        <div id="right-container" className="my-2 lg:my-24">
          <TopAuthorList />
        </div>
      </div>
    </div>
  );
}

export default Articles;
