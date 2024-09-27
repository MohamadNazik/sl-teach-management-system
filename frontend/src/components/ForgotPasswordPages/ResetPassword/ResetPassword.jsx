import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ForgotPasswordContext } from "../../../utils/context/ForgotPasswordContext";
import { toastAlert } from "../../../utils/Alerts/toastAlert";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user } = useContext(ForgotPasswordContext);
  const [isAuth, setIsAuth] = useState(false);

  const [isHide, setIsHide] = useState(true);
  const [isNewHide, setINewsHide] = useState(true);

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
      .post(`${backendUrl}/admin/reset-password`, {
        staffId: user.staffId,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          navigate("/", { replace: true });
          setIsAuth(false);
          toastAlert("success", "Password Changed !");
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
  return (
    <section className="h-screen flex items-center justify-center">
      <div className="w-[45rem] flex flex-col items-center m-5 bg-white p-2 rounded-xl pt-8 drop-shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#BF3606]">
          Reset Your Password
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-[30rem] flex flex-col items-center"
        >
          <div className="mt-10 w-[20rem] flex flex-col gap-3">
            <div className="relative">
              <label>New Password: </label>
              <input
                type={isNewHide ? "password" : "text"}
                name="new"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="block w-full  max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
              <div
                className="text-black/75 text-xl absolute right-4 top-9 cursor-pointer"
                onClick={() => {
                  setINewsHide((prev) => !prev);
                }}
              >
                {isNewHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>
            <div className="relative">
              <label>Confirm New Password: </label>
              <input
                type={isHide ? "password" : "text"}
                name="confirm"
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                }}
                className="block w-full max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
              <div
                className="text-black/75 text-xl absolute right-4 top-9 cursor-pointer"
                onClick={() => {
                  setIsHide((prev) => !prev);
                }}
              >
                {isHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white"
          >
            Update Password
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
  );
};

export default ResetPassword;
