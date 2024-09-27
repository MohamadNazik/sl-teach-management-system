import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toastAlert } from "../../../utils/Alerts/toastAlert";
import { ForgotPasswordContext } from "../../../utils/context/ForgotPasswordContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const { setUser } = useContext(ForgotPasswordContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${backendUrl}/admin/forgot-password`, {
        email: email,
      })
      .then((response) => {
        // console.log(response.data);
        if (response.data.status.toLowerCase() === "pending") {
          setUser(response.data.data);
          navigate("/forgot-password/verify-otp", { replace: true });
          toastAlert("success", `OTP sent to ${email}`);
        }
      })
      .catch((error) => {
        if (error.response) {
          // Handle invalid credentials
          toastAlert("error", error.response.data.message);
        } else {
          // Handle server or network error
          toastAlert("error", "Server Error!");
        }
      });
  };

  // Check if the current path is /forgot-password/verify-otp
  const isVerifyOTPRoute = location.pathname === "/forgot-password/verify-otp";
  const isVerifyResetPasswordRoute =
    location.pathname === "/forgot-password/reset-password";
  return (
    <>
      {!isVerifyOTPRoute && !isVerifyResetPasswordRoute && (
        <section className="h-screen flex items-center justify-center">
          <div className="w-[45rem] flex flex-col items-center m-5 bg-white p-2 rounded-xl pt-8 drop-shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#BF3606]">
              Did you forget your password?
            </h1>
            <h3 className="mt-8 mb-4 text-md">
              Enter your email to get an OTP
            </h3>

            <form
              onSubmit={handleSubmit}
              className="w-[30rem] flex flex-col items-center"
            >
              <input
                type="text"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="block w-full max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder="Email address"
                required
              />

              <button
                type="submit"
                className="text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white"
              >
                Send OTP
              </button>
            </form>
          </div>
        </section>
      )}
      <Outlet />
    </>
  );
};

export default ForgotPassword;
