import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { storingUserToLS } from "@/utils/helper";
import { signupAuthorAPI } from "@/api/authApi";
import toast from "react-hot-toast";
import { BlogIcon } from "@/assets/Icons";
import { AuthLoadingOverlay } from "../Loading";

function AuthorRegister() {
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // console.log(formValues);
      createNewAuthor(
        formValues.fname,
        formValues.lname,
        formValues.username,
        formValues.password,
        formValues.confirmPassword
      );
    }
  }, [formErrors]);

  // sending the values to the backend bia api
  async function createNewAuthor(
    fname,
    lname,
    username,
    password,
    confirmPassword
  ) {
    setIsLoading(true);
    try {
      const result = await signupAuthorAPI(
        fname,
        lname,
        username,
        password,
        confirmPassword
      );
      if (result?.success) {
        const { token, user } = result;
        const expiry = storingUserToLS(user, token);
        setAuth({
          isAuthenticated: true,
          token: token,
          userInfo: user,
          expiry: expiry,
        });
        toast.success(
          result.msg || "The Author Profile is created successfully!"
        );
        navigate("/articles");
      } else {
        toast.error(result.msg || "Problem creating Author Profile");
        // console.log(result);
      }
    } catch (error) {
      console.log("Error occured", error);
      toast.error("Failed to create Author");
    } finally {
      setIsLoading(false);
    }
  }

  function validate(values) {
    const errors = {};
    const regExp = { username: /^[a-zA-Z0-9!@#$%^&*()_+]{4,14}$/i };

    if (!values.fname) {
      errors.fname = "First Name is required!";
    }
    if (!values.lname) {
      errors.lname = "Last Name is required!";
    }
    if (!values.username) {
      errors.username = "Username is required";
    } else if (!regExp.username.test(values.username)) {
      errors.username =
        "Username must be between 4-14 characters without any space\n Numbers and Special Characters are allowed";
    }
    if (!values.password) {
      errors.password = "password is required!";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required!";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "The passwords don't match!";
    }
    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  if (isLoading) {
    return <AuthLoadingOverlay />;
  }

  return (
    <div className="h-full w-full flex justify-center items-center bg-slate-100">
      <section className="bg-white m-10 rounded-lg max-w-screen-xl min-w-80">
        <div className="lg:grid lg:min-h-full lg:grid-cols-12">
          <section className="relative  flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6 rounded-lg">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              className="absolute inset-0 h-full w-full object-cover opacity-80 lg:rounded-l-lg"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <Link to="/">
                <BlogIcon height="40" width="40" color="white" fill="white" />
              </Link>

              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to InQPress
              </h2>

              <p className="mt-4 leading-relaxed text-white/90">
                Stay updated with the latest trends, insights, and tips from the
                world of technology, development, and more.
              </p>
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <Link
                  className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                  to="/"
                >
                  <span className="sr-only">Home</span>
                  <BlogIcon height="35" width="35" />
                </Link>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Welcome to InqPress
                </h1>
              </div>

              <div className="font-semibold md:font-bold text-xl md:text-2xl mt-2">
                Become an Author
              </div>
              <form
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                className="mt-6 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="fname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>

                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="First Name"
                    value={formValues.fname}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm"
                  />
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.fname}
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="lname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>

                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder="Last Name"
                    value={formValues.lname}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm"
                  />
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.lname}
                  </p>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Username
                  </label>

                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formValues.username}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm"
                  />
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.username}
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formValues.password}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm"
                  />
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.password}
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password Confirmation
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 shadow-sm"
                  />{" "}
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.confirmPassword}
                  </p>
                </div>
                <div className="md:flex col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-black bg-black px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-black focus:outline-none focus:ring active:text-blue-500"
                  >
                    Create an account
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <Link to="/login" className="text-gray-700 underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

export default AuthorRegister;
