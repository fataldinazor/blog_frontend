import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
//Root
import Root from "./components/Root/Root";
import Homepage from "./components/Root/Homepage";
//Articles
import Articles from "./components/Articles/Articles";
import ArticleId from "./components/Articles/ArticleId"
//Authorization
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import UserRegister from "./components/Auth/UserRegister";
import AuthorRegister from "./components/Auth/AuthorRegister"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Homepage />} />
      <Route path="register" element={<Register/>}>
        <Route path="user" element={<UserRegister/>}/>
        <Route path="author" elemenet={<AuthorRegister/>}/>
      </Route>
      <Route path="login" element={<Login/>}/>
      <Route path="articles" elements={<Articles />} >
        <Route path=":articleId" element={<ArticleId/>}/>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
