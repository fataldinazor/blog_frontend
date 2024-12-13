import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

function Root() {
  return (
    <div className="root-component">
      <Toaster position="botton-center"/>
      <Header />
      <Outlet />
    </div>
  );
}

export default Root;
