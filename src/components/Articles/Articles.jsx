import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import {Link} from "react-router-dom"
import { truncateString } from "../../utiils/helper";
import ahead from "../../assets/ahead.svg";
import { fetchAllPublishedArticles } from "../../api/articleApi";

function Articles() {
  const [articles, setArticles] = useState([]);
  const { auth } = useAuth();
  const location = useLocation();

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
  console.log(articles);
  return (
    <div id="full-page" className="bg-slate-100">
      <div
        id="container"
        className=" mx-40 outline-dotted grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 "
      >
        <div id="left-container" className="lg:col-span-3 outline-dotted">
          <div id="top section" className="h-24 m-2 outline-dotted">
            <h1 className="text-4xl">Some sort of Seach section here</h1>
          </div>
          {articles.length > 0 ? (
            <div
              id="article-card-container"
              className="m-4 flex flex-col gap-5"
            >
              {articles.map((article) => (
                <div
                  id="artcile-card"
                  key={article.id}
                  className="max-w-4xl overflow-hidden bg-white rounded-lg shadow-md light:bg-white "
                >
                  {article.image_url &&<img
                    className="object-cover w-full h-64"
                    src={article.image_url}
                    alt="cover-image"
                  />}
                  <div className="px-6 py-2">
                    <span className="block float text-sm font-semibold text-gray-500">
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
                        className="block text-5xl font-bold transition-colors duration-300 transform text-black hover:text-gray-600 hover:underline"
                        tabIndex="0"
                        role="link"
                      >
                        {article.title}
                      </Link>
                      <p
                        className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: truncateString(article.content, 175),
                        }}
                      ></p>
                    </div>

                    <div className="flex justify-between mt-4 mb-2 ml-1 float">
                      <div className="flex items-center">
                        {/* Avatar */}
                        <img
                          className="w-10 h-10 object-cover rounded-full shadow-sm"
                          src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                          alt="Avatar"
                        />

                        {/* User Info */}
                        <div className="ml-3 flex items-center space-x-2">
                          <div>
                            <p className="text-xs leading-none font-normal pb-0.5 text-gray-500">
                              Published by
                            </p>
                            <a
                              href="#"
                              className="text-lg leading-none font-semibold text-gray-800 hover:underline"
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
                          className="pr-2 cursor-pointer"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No Content to show!</p>
          )}
        </div>
        <div id="right-container" className="m-2 outline-dotted">
          <h1>Top Authors</h1>
        </div>
      </div>
    </div>
  );
}

export default Articles;
