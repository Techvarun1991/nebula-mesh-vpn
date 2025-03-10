import logo from './CDAC_L.png';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS for proper styling
import { useAuth } from "../AuthContext";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return "";
  };

  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(getCookie("email"));
  const [password, setPassword] = useState(getCookie("password"));
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const handleEmailChange = (e) => {
    // e.preventDefault();
    const value = e.target.value;
    setEmail(value);

    // Email validation regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Email validation using regex
    if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  const handlePasswordChange = (e) => {
    // e.preventDefault();
    const value = e.target.value;
    setPassword(value);

    // Email validation regex pattern
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Email validation using regex
    if (!passwordPattern.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setCredentials({username: email, password: password});
    if (email && password && !emailError && !passwordError) {
      const response = await login(credentials)
      // console.log("Response: ", response);
      if (response) {
        navigate('/dashboard')
      }
    }
     else {
      if (!email) {
        setEmailError("Please enter a valid email");
      }
      if (!password) {
        setPasswordError("Please enter a valid password");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="max-w-3xl text-center mx-auto py-48">
      <div className="flex space-x-3">
        <div className="w-1/2 ">
        <div className="">
          <img src={logo} className='mx-auto '/>
          </div>
        </div>

        <div className="w-1/2 p-6 flex flex-col justify-start text-start">
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="mb-4 font-semibold">
            to access your dashboard!
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Id<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={handleEmailChange}
              />
              {emailError && <span style={{ color: "red" }}>{emailError}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password<span style={{ color: "red" }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                    >
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path
                        fill-rule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                    >
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                  )}
                </span>
              </div>
              {passwordError && (
                <span style={{ color: "red" }}>{passwordError}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <a href="/forgotpassword" className="text-sm text-blue-600">
                Forgot Password?
              </a>
            </div>
            <button
              className="w-full py-2 bg-teal-500 text-white rounded-md"
              onClick={handleLogin}
            >
              LOGIN
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
