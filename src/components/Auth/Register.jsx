// import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { roles } from "@/utils/helper";

function Register() {
  const location = useLocation();
  return (
    <div className="h-full w-full flex justify-center items-center">
      {location.pathname === "/register" && (
      <div className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-8 mx-auto">
          <div className="xl:items-center xl:-mx-8 xl:flex">
            <div className="flex flex-col items-center xl:items-start xl:mx-8">
              <h1 className="text-2xl font-medium font-bold text-gray-800 capitalize lg:text-3xl dark:text-white">
                Sign Up as
              </h1>

              <div className="mt-2 md:mt-4">
                <span className="inline-block w-40 h-1 bg-black rounded-full"></span>
                <span className="inline-block w-3 h-1 mx-1 bg-black rounded-full"></span>
                <span className="inline-block w-1 h-1 bg-black rounded-full"></span>
              </div>

              <p className="mt-4 font-medium text-gray-500 dark:text-gray-300">
                You can get Access by selecting your role!
              </p>
            </div>

            <div className="flex-1 xl:mx-8">
              <div className="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="max-w-sm mx-auto border rounded-lg md:mx-4 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <h1 className="text-xl font-medium text-gray-700 capitalize lg:text-2xl dark:text-white">
                        {role.title}
                      </h1>

                      <p className="mt-4 text-gray-500 dark:text-gray-300">
                        {role.description}
                      </p>
                      <Link to={role.link}>

                        <button className="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-black border border-black rounded-md hover:bg-white hover:text-black focus:outline-none focus:text-black focus:bg-white focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                          {role.buttonText}
                        </button>
                      </Link>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="p-6">
                      <h1 className="text-lg font-medium text-gray-700 capitalize lg:text-xl dark:text-white">
                        What you access you get
                      </h1>

                      <div className="mt-8 space-y-4">
                        {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-5 h-5 ${
                                role.includedFeatures[featureIndex]
                                  ? "text-emerald-500"
                                  : "text-red-400"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d={
                                  role.includedFeatures[featureIndex]
                                    ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    : "M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                }
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="mx-4 text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>)}
      <Outlet/>
    </div>
  );
}

export default Register;
