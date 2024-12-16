import { Triangle } from "react-loader-spinner";

function Loading({ color, width, height }) {
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
      <p className="text-xs">Loading...</p>
    </div>
  );
}

function LoadingOverlay() {
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
        <p className="text-xs">Loading...</p>
      </span>
    </div>
  );
}

function AuthLoadingOverlay() {
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
        <div className="flex fle-col text-xs">
          <p>Loading...</p>
          <p>Server may take a few seconds to wake up</p>
          <p>Please wait a while</p>
        </div>
      </span>
    </div>
  );
}

export { Loading, LoadingOverlay, AuthLoadingOverlay };
