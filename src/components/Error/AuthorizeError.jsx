import { Link, useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate=useNavigate()
  return (
    <div className="flexx flex-col my-44 place-content-center bg-white px-4">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-9xl font-black text-gray-200">403</h1>

        <p className="text-2xl font-bold tracking-tight text-black sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">
          You&apos;re not Authorized to access this page.
        </p>

        <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
          <button
            onClick={() => navigate(-3)}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            <span>Go back</span>
          </button>
          <Link
            to="/"
            className="w-1/2 px-5 py-2 text-sm tracking-wide border text-white transition-colors duration-200 bg-black rounded-lg shrink-0 sm:w-auto hover:bg-white hover:text-black dark:hover:bg-blue-500 dark:bg-blue-600"
          >
            <button>Take me home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotAuthorized;
