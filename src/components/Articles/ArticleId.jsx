import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  fetchArticleWithId,
  fetchMoreArticles,
  UserLikedBookmarkPost,
  handleLike,
  handleBookmark,
} from "../../api/articleApi";
import { useAuth } from "../../context/AuthContext";
import { truncateString } from "../../utils/helper";
import { BlogIcon } from "../../assets/Icons";
import {
  BookmarkIcon,
  LikedIcon,
  CommentIcon,
  ShareIcon,
} from "../../assets/Icons";
import { Triangle } from "react-loader-spinner";

const Comments = lazy(() => import("./Comments"));

function MoreArticles() {
  const [moreArticles, setMoreArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchMoreArticles(auth.token, params.articleId);
        if (result.length > 6) randomizeArticles(result);
        else if (result.length > 0 && result.length <= 6)
          setMoreArticles[result];
        else {
          console.log("No Articles available to show right now");
        }
      } catch (error) {
        console.log("error occured" + error);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 5000);
  }, [auth.token, params.articleId]);

  function randomizeArticles(moreArticles) {
    let articleArr = [];
    let set = new Set();
    while (articleArr.length < 6) {
      const randomNumber = Math.floor(Math.random() * moreArticles.length);
      if (!set.has(randomNumber)) {
        articleArr.push(moreArticles[randomNumber]);
        set.add(randomNumber);
      }
    }
    setMoreArticles(articleArr);
  }

  return (
    <div id="more-articles-container" className="rounded-lg pb-3">
      <h1 className="text-2xl mt-4 md:mt-0 md:text-xl lg:text-2xl font-bold pb-2 mb-2">
        Suggested Reads →
      </h1>

      {isLoading ? (
        <div className="h-96 flex justify-center items-center">
          <Triangle
            visible={true}
            height="40"
            width="40"
            color="#000000"
            ariaLabel="triangle-loading"
          />
        </div>
      ) : (
        <div
          id="more-article-cards"
          className="grid grid-cols-2 lg:flex lg:flex-col gap-4"
        >
          {moreArticles.length > 0 ? (
            moreArticles.map((article) => (
              <article
                key={article.id}
                className="flex bg-white transition hover:shadow-xl py-2 pr-2 rounded-lg"
              >
                <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
                  <time
                    dateTime={new Date(article.updatedAt).toISOString()}
                    className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
                  >
                    <span>
                      {new Date(article.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                      })}
                    </span>
                    <span className="w-px flex-1 bg-gray-900/10"></span>
                    <span>
                      {new Date(article.updatedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </time>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  {article.image_url && (
                    <div>
                      <img
                        alt="cover-image"
                        src={article.image_url}
                        className="w-full object-cover h-40"
                      />
                    </div>
                  )}
                  <div className="py-4 sm:border-l-transparent sm:py-2 flex justify-between">
                    <Link to={`/articles/${article.id}`}>
                      <h3 className="text-sm font-semibold md:font-bold uppercase text-gray-900">
                        {truncateString(article.title, 35)}
                      </h3>
                      <p className="text-gray-600 text-xs">
                        by{" "}
                        <Link
                          to={`/profile/${article.user.id}`}
                          className="font-semibold"
                        >
                          {article.user.username}
                        </Link>
                      </p>
                    </Link>
                    <Link
                      to={`/articles/${article.id}`}
                      className="flex items-center px-4 py-2 text-center text-xs font-bold uppercase text-gray-900"
                    >
                      <BlogIcon
                        className="my-auto"
                        height="20"
                        width="20"
                        color="black"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p>No Articles to show here now</p>
          )}
        </div>
      )}
    </div>
  );
}

function Article({ article, user }) {
  return (
    <main>
      <article>
        {article.image_url && (
          <header className="mx-auto max-w-screen-xl flex flex-col text-left items-start">
            <img
              className="w-full object-cover h-60 md:h-80 rounded-tl-lg rounded-tr-md"
              src={article.image_url}
              alt="Featured Image"
            />
          </header>
        )}
        <div className="px-5 md:px-10">
          <div className="mx-auto max-w-screen-md text-lg tracking-wide text-gray-700">
            <p className="text-sm text-gray-500 md:text-base">
              Published{" "}
              {new Date(article.updatedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date(article.updatedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "numeric",
              })}
            </p>
            <h1 className="mt-1 text-2xl leading-tight md:text-3xl md:leading-snug lg:text-4xl font-bold text-gray-900">
              {article.title}
            </h1>
            <div
              className="mt-4 flex flex-wrap justify-center gap-2"
              aria-label="Tags"
            ></div>
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
                  <p className="text-xs lg:text-sm leading-none font-normal lg:pb-0.5 text-gray-500">
                    Published by
                  </p>
                  <Link
                    to={`/author/${user.id}`}
                    className="text-sm md:text-md lg:text-lg leading-none font-semibold text-gray-800 hover:underline"
                    tabIndex="0"
                    role="link"
                  >
                    {user.username}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mx-auto max-w-screen-md my-4 py-2 text-sm md:text-base font-serif text-justify md:text-lg tracking-wide text-gray-900"
            dangerouslySetInnerHTML={{
              __html: article.content,
            }}
          ></div>
        </div>
      </article>
    </main>
  );
}

function PostInteraction({ counts }) {
  const [isLiked, setIsLiked] = useState();
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState();
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const { auth } = useAuth();
  const params = useParams();
  useEffect(() => {
    if (counts) {
      setLikesCount(counts.likes);
      setBookmarkCount(counts.bookmarks);
      setCommentCount(counts.comments);
    }
  }, [counts]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await UserLikedBookmarkPost(auth.token, params.articleId);
      setIsLiked(result.liked);
      setIsBookmarked(result.bookmarked);
    };
    fetchData();
    // console.log(likesCount, bookmarkCount, isLiked, isBookmarked, commentCount);
  }, [params.articleId]);

  async function handleLikeBtn() {
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    //if req fails due to any reason roll back to previous state
    const rollback = (prevState) => {
      setIsLiked(prevState);
      setLikesCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    };
    try {
      const result = await handleLike(auth.token, params.articleId);
      if (!result) {
        rollback(previousState);
        // handle error here
        // alert("Something went wrong. Couldn't like the Post")
      }
    } catch (error) {
      rollback(previousState);
      console.error(`Faied to perform action ${error}`);
    }
  }

  async function handleBookmarkBtn() {
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setBookmarkCount((prevCount) =>
      isBookmarked ? prevCount - 1 : prevCount + 1
    );
    //rollback function
    const rollback = (prevState) => {
      setIsBookmarked(prevState);
      setBookmarkCount((prevCount) =>
        isBookmarked ? prevCount + 1 : prevCount - 1
      );
    };
    try {
      const result = await handleBookmark(auth.token, params.articleId);
      // throw new Error("some error");
      if (!result) {
        rollback(previousState);
      }
    } catch (error) {
      rollback(previousState);
      console.error(`Failed to bookmark this Article! ${error}`);
    }
  }

  return (
    <div className="flex justify-evenly items-center py-2 lg:flex-col lg:justify-center lg:items-center lg:gap-5 text-center text-gray-500 font-semibold text-sm lg:sticky top-5">
      <div id="like-article" className="flex gap-2 lg:flex-col items-center">
        <button onClick={handleLikeBtn}>
          {isLiked ? (
            <LikedIcon fillColor="red" stroke="red" />
          ) : (
            <LikedIcon fillColor="#fffffh" stroke="#000000" />
          )}
        </button>
        <p>{likesCount}</p>
      </div>

      <div id="comment-article" className="flex gap-2 lg:flex-col items-center">
        <button>
          <CommentIcon />
        </button>
        <p>{commentCount}</p>
      </div>

      <div
        id="bookmark-article"
        className="flex gap-2 lg:flex-col items-center"
      >
        <button onClick={handleBookmarkBtn}>
          {isBookmarked ? (
            <BookmarkIcon fillColor="#000000" />
          ) : (
            <BookmarkIcon fillColor="#EFF2F4" />
          )}
        </button>
        <p>{bookmarkCount}</p>
      </div>

      <div id="share-article">
        <ShareIcon className="pr-3" />
      </div>
    </div>
  );
}

function ArticleId() {
  const [article, setArticle] = useState({});
  const [user, setUser] = useState({});
  const [showCommentsComponent, setShowCommentsComponent] = useState(false);
  const commentComponentRef = useRef();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  // const location = useLocation();
  const params = useParams();
  useEffect(() => {
    // window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const result = await fetchArticleWithId(auth.token, params.articleId);
        setArticle(result);
        setUser(result.user);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 2000);
  }, [params.articleId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (enteries) => {
          if (enteries[0].isIntersecting) {
            setShowCommentsComponent(true);
            observer.disconnect();
          }
        },
        { root: null, margin: "0px", threshold: 0.1 }
      );
      if (commentComponentRef.current)
        observer.observe(commentComponentRef.current);
      // useEffect clean up function
      return () => {
        if (commentComponentRef.current)
          observer.unobserve(commentComponentRef.current);
      };
    }, 3000);

    // clean up if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [commentComponentRef, params.articleId]);

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
    <div id="full-page" className="bg-gray-100 min-w-96">
      <div id="container" className="lg:mx-10 lg:py-8">
        <div className="flex flex-col md:grid  lg:grid-cols-12 lg:gap-x-5">
          <div
            id="left-side"
            className="bg-white z-10 mx-1 fixed bottom-0 w-full lg:static lg:bg-inherit lg:col-span-1 lg:py-20 lg:pl-10 p"
          >
            {article?._count && <PostInteraction counts={article._count} />}
          </div>

          <div
            id="middle"
            className="m-2 lg:col-span-8 flex flex-col bg-white rounded-lg"
          >
            <Article article={article} user={user}></Article>
            <div ref={commentComponentRef}>
              {showCommentsComponent && (
                <Suspense
                  fallback={
                    <Triangle
                      visible={true}
                      height="40"
                      width="40"
                      color="#000000"
                      ariaLabel="triangle-loading"
                    />
                  }
                >
                  <Comments />
                </Suspense>
              )}
            </div>
          </div>

          <div
            id="right-side"
            className="w-full px-2 min-w-48 mb-20 lg:col-span-3"
          >
            <MoreArticles />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleId;
