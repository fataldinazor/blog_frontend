import { Triangle } from "react-loader-spinner";
import { useEffect, useState } from "react";

function Loading({ color, width, height }) {
  const [showServerMessage, setShowServerMessage] = useState(false);

  useEffect(() => {
    // Set a timeout to show the server message after 5000 ms
    const timer = setTimeout(() => {
      setShowServerMessage(true);
    }, 10000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-48 flex flex-col justify-center items-center gap-1">
      <Triangle
        visible={true}
        height={`${height}` || "80"}
        width={`${width}` || "80"}
        color={`${color}` || "#00000"}
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <div className="text-xs flex flex-col items-center text-gray-400">
        <p>Loading...</p>
        {showServerMessage && (
          <div className="flex flex-col text-center text-xs">
            <p>Server may take a few seconds to wake up</p>
            <p>Please Wait</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingOverlay() {
  const [showServerMessage, setShowServerMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServerMessage(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="absolute inset-0 bg-white rounded-lg bg-opacity-90 z-40 flex items-center justify-center">
      <span className="text-lg font-semibold text-black">
        <Triangle
          visible={true}
          height="40"
          width="40"
          color="#000000"
          ariaLabel="triangle-loading"
        />
        <div className="text-xs flex flex-col items-center text-gray-400">
          <p>Loading...</p>
          {showServerMessage && (
            <div className="flex flex-col text-center text-xs">
              <p>Server may take a few seconds to wake up</p>
              <p>Please Wait</p>
            </div>
          )}
        </div>
      </span>
    </div>
  );
}

function AuthLoadingOverlay() {
  const [showServerMessage, setShowServerMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServerMessage(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 bg-white rounded-lg bg-opacity-90 z-40 flex items-center justify-center">
      <div className="text-lg font-semibold text-black flex flex-col items-center space-y-4">
        <Triangle
          visible={true}
          height="40"
          width="40"
          color="#000000"
          ariaLabel="triangle-loading"
        />
        <div className="text-xs flex flex-col items-center text-gray-400">
          <p>Loading...</p>
          {showServerMessage && (
            <div className="flex flex-col text-center text-xs">
              <p>Server may take a few seconds to wake up</p>
              <p>Please Wait</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Loading, LoadingOverlay, AuthLoadingOverlay };
