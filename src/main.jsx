import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
  Router,
} from "react-router-dom";
import "./index.css";
//Root
import Root from "./components/Root/Root";
import Homepage from "./components/Root/Homepage";
//Articles
import Articles from "./components/Articles/Articles";
import ArticleId from "./components/Articles/ArticleId";
//Authentication
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import UserRegister from "./components/Auth/UserRegister";
import AuthorRegister from "./components/Auth/AuthorRegister";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={
      <AuthProvider>
        <Root/>
      </AuthProvider>
    }>
      <Route index element={<Homepage />} />
      <Route path="register" element={<Register />}>
        <Route path="user" element={<UserRegister />} />
        <Route path="author" element={<AuthorRegister />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "AUTHOR", "USER"]}/>}>
        <Route path="articles" element={<Articles />}>
          <Route path=":articleId" element={<ArticleId />} />
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
