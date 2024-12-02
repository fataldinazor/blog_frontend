import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  fetchArticleWithId,
  fetchMoreArticles,
  UserLikedBookmarkPost,
  handleLike,
} from "../../api/articleApi";
import { useAuth } from "../../context/AuthContext";
import { truncateString } from "../../utiils/helper";
import aheadForArticles from "../../assets/aheadForArticles.svg";
import comment from "../../assets/comment.svg";
import bookmark from "../../assets/bookmark.svg";
import share from "../../assets/share.svg";
import { BookmarkIcon, LikedIcon } from "../../assets/Icons";

const Comments = lazy(() => import("./Comments"));

function MoreArticles() {
  const [moreArticles, setMoreArticles] = useState([]);
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchMoreArticles(auth.token, params.articleId);
      // console.log(result);
      if (result.length > 6) randomizeArticles(result);
      else if (result.length > 0 && result.length <= 6) setMoreArticles[result];
      else {
        console.log("No Articles available to show right now");
      }
    };
    fetchData();
  }, [auth.token, params.articleId]);

  function randomizeArticles(moreArticles) {
    let articleArr = [];
    let set = new Set();
    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * moreArticles.length);
      if (!set.has(randomNumber)) {
        articleArr.push(moreArticles[randomNumber]);
        set.add(randomNumber);
      }
    }
    setMoreArticles(articleArr);
  }
  return (
    <div id="more-articles-container">
      <h1 className="text-3xl font-bold p-2">Suggested Reads →</h1>
      <div id="more-article-cards" className="flex flex-col gap-4">
        {moreArticles.length
          ? moreArticles.map((article) => (
              <article
                key={article.id}
                className="flex bg-white transition hover:shadow-xl py-2 pr-2"
              >
                <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
                  <time
                    dateTime={article.updatedAt.toLocaleDateString}
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
                    <div className="">
                      <img
                        alt="cover-image"
                        src={article.image_url}
                        className=" w-full object-cover h-40"
                      />
                    </div>
                  )}
                  <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-2 flex justify-between">
                    <Link to={`/articles/${article.id}`}>
                      <h3 className="font-bold uppercase text-gray-900">
                        {truncateString(article.title, 30)}
                      </h3>
                      <p className="text-gray-600 text-xs">
                        by{" "}
                        <span className="font-semibold">
                          {article.user.username}
                        </span>
                      </p>
                    </Link>
                    <Link
                      to={`/articles/${article.id}`}
                      className="block  bg-black px-4 py-2 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400 flex "
                    >
                      <img
                        className=""
                        src={aheadForArticles}
                        alt="Go to article"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          : "No Articles to show here now"}
      </div>
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
              className="w-full object-cover h-80"
              src={article.image_url}
              alt="Featured Image"
            />
          </header>
        )}
        <div className="mx-auto max-w-screen-md text-lg tracking-wide text-gray-700">
          <p className="text-gray-500 text-base">
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
          <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-5xl">
            {article.title}
          </h1>
          <div
            className="mt-4 flex flex-wrap justify-center gap-2"
            aria-label="Tags"
          ></div>
          <div className="flex items-center">
            <img
              className="w-10 h-10 object-cover rounded-full shadow-sm"
              src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
              alt="Avatar"
            />

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
                  {user.username}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mx-auto max-w-screen-md my-4 py-2 font-serif text-justify text-lg tracking-wide text-gray-700"
          dangerouslySetInnerHTML={{
            __html: article.content,
          }}
        ></div>
      </article>
    </main>
  );
}

function PostInteraction({ counts }) {
  console.log(counts);
  const [isLiked, setIsLiked] = useState();
  const [isBookmarked, setIsBookmarked] = useState();
  const [likesCount, setLikesCount] = useState(0);
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
  }, []);

  async function handleLikeBtn() {
    //need to work on this functionality
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked((prev) => !prev);
    try {
      const result = await handleLike(auth.token, params.articleId);
      console.log(result);
    } catch (error) {
      console.error(`Faied to perform action ${error}`);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div id="like-article">
        <button onClick={handleLikeBtn}>
          {isLiked ? (
            <LikedIcon fillColor="red" stroke="none" />
          ) : (
            <LikedIcon fillColor="#fffffh" stroke="#000000" />
          )}
        </button>
        <p className="text-center">{likesCount}</p>
      </div>
      <div id="comment-article">
        <button>
          <img src={comment} alt="Comment" className="pl-0.5 cursor-pointer" />
        </button>
        <p className="text-center">{counts.comments}</p>
      </div>
      <div id="bookmark-article">
        <button>
          {isBookmarked ? (
            <BookmarkIcon fillColor="#000000" />
          ) : (
            <BookmarkIcon fillColor="#EFF2F4" />
          )}
        </button>
        <p className="text-center">{bookmarkCount}</p>
      </div>
      <div id="share-article">
        <img src={share} alt="Share" />
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
  // const location = useLocation();
  const params = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const result = await fetchArticleWithId(auth.token, params.articleId);
        setArticle(result);
        setUser(result.user);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchData();
  }, [params.articleId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (enteries) => {
          // console.log("Observer triggered", enteries);
          if (enteries[0].isIntersecting) {
            // console.log("Comments are in viewport");
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

    // clean if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [commentComponentRef, params.articleId]);

  return (
    <div id="full-page" className="bg-gray-100">
      <div id="container" className="mx-20 outline-dotted">
        <div className="grid grid-cols-12">
          <div id="left-side" className="col-span-1 outline-dotted">
            {article?._count && <PostInteraction counts={article._count} />}
          </div>
          <div id="middle" className="col-span-8 flex flex-col outline-dotted">
            <Article article={article} user={user}></Article>
            <div ref={commentComponentRef}>
              {showCommentsComponent && (
                <Suspense fallback={<div>Comments are Loading...</div>}>
                  <Comments />
                </Suspense>
              )}
            </div>
          </div>
          <div id="right-side" className="col-span-3 outline-dotted">
            <MoreArticles />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleId;
