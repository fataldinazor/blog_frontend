import { Outlet } from "react-router-dom";
import Header from "./Header";

function Root() {
  return (
    <div className="root-component">
        <Header />
        <Outlet />
    </div>
  );
}

export default Root;
