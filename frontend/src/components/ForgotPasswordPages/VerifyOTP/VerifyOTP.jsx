import React, { useContext, useEffect, useState } from "react";
import { Link, replace, useNavigate } from "react-router-dom";
import { ForgotPasswordContext } from "../../../utils/context/ForgotPasswordContext";
import axios from "axios";
import { toastAlert } from "../../../utils/Alerts/toastAlert";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const VerifyOTP = () => {
  const [otp, setOtp] = useState();
  const { user } = useContext(ForgotPasswordContext);
  const [isAuth, setIsAuth] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isEmpty = Object.entries(user).length === 0;
    if (isEmpty) {
      setIsAuth(false);
      navigate("/forgot-password", { replace: true });
    } else {
      setIsAuth(true);
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      setIsAuth(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios
      .post(`${backendUrl}/admin/verifyOTP`, {
        staffId: user.staffId,
        otp: otp,
      })
      .then((response) => {
        setIsLoading(false);
        if (response.data.success) {
          //console.log(response.data);

          navigate("/forgot-password/reset-password");
          toastAlert("success", "OTP verified");
        }
      })
      .catch((error) => {
        if (error.response) {
          // Handle invalid credentials
          toastAlert("error", error.response.data.message);
          setIsLoading(false);
        } else {
          // Handle server or network error
          toastAlert("error", "Server Error!");
          setIsLoading(false);
        }
      });
  };

  return isAuth ? (
    <section className="flex items-center justify-center mt-16">
      <div className="w-[25rem] sm:w-[45rem] flex flex-col items-center m-5 bg-white p-2 rounded-xl pt-8 drop-shadow-2xl">
        <h1 className="text-xl sm:text-3xl font-bold text-[#BF3606]">
          OTP Verification
        </h1>
        <h3 className="mt-8 mb-6 text-lg">
          Enter the 4-digit One Time Passcode(OTP) that sent to{" "}
          <span className="text-blue-700">{user.email}</span>
        </h3>

        <form
          onSubmit={handleSubmit}
          className="w-[30rem] flex flex-col items-center"
        >
          <input
            type="text"
            name="code"
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            maxLength={4}
            className="block w-full max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
            placeholder="4-Digit code"
            required
          />

          <button
            type="submit"
            className="text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white"
          >
            Verify OTP
          </button>
        </form>
      </div>
      {isLoading && (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </section>
  ) : (
    <div>Page Not Found!</div>
  );
};

export default VerifyOTP;
