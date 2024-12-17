import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import { LoadingOverlay } from "./components/Loading";

//Root
import Root from "./components/Root/Root";
import Homepage from "./components/Root/Homepage";

//Authentication
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import UserRegister from "./components/Auth/UserRegister";
import AuthorRegister from "./components/Auth/AuthorRegister";

//Articles
const ArticlesLayout = lazy(() =>
  import("./components/Articles/ArticlesLayout")
);
const CreateArticles = lazy(() =>
  import("./components/Articles/CreateArticles")
);
import Articles from "./components/Articles/Articles";
const ArticleId = lazy(() => import("./components/Articles/ArticleId"));
const UpdateArticles = lazy(() =>
  import("./components/Articles/UpdateArticles")
);

import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

// Author
const AuthorLayout = lazy(() => import("./components/Author/AuthorLayout"));
import AuthorPage from "./components/Author/AuthorPage";

// Error Pages
import NotFoundPage from "./components/Error/NotFoundPage";
import NotAuthorized from "./components/Error/AuthorizeError";
import ErrorBoundary from "./components/Error/ErrorBoundary";

// const LazyFallBack = <LoadingOverlay />;

const router = createBrowserRouter(
  createRoutesFromElements(
    // Root  
    <Route
      path="/"
      element={
        <AuthProvider>
          <Root />
        </AuthProvider>
      }
      errorElement={<ErrorBoundary />}
    >
      <Route index element={<Homepage />} />
      <Route path="register" element={<Register />}>
        <Route path="user" element={<UserRegister />} />
        <Route path="author" element={<AuthorRegister />} />
      </Route>
      <Route path="login" element={<Login />} />

      {/* Author  */}
      <Route
        path="author"
        element={
          <Suspense fallback={<LoadingOverlay />}>
            <AuthorLayout />
          </Suspense>
        }
        errorElement={<ErrorBoundary />}
      >
        <Route path=":authorId" element={<AuthorPage />} />
      </Route>

        {/* Articles  */}
      <Route
        element={<ProtectedRoute allowedRoles={["ADMIN", "AUTHOR", "USER"]} />}
      >
        <Route
          path="articles"
          element={
            <Suspense fallback={<LoadingOverlay />}>
              <ArticlesLayout />
            </Suspense>
          }
          errorElement={<ErrorBoundary />}
        >
          <Route index element={<Articles />} />
          <Route
            path=":articleId"
            element={
              <Suspense fallback={<LoadingOverlay />}>
                <ArticleId />
              </Suspense>
            }
          />
          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]} />}
          >
            <Route
              path="new"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <CreateArticles />
                </Suspense>
              }
            />
            <Route
              path=":articleId/update"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <UpdateArticles />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Static Error Pages  */}
      <Route path="403" element={<NotAuthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<LoadingOverlay />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
