import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ForgotPasswordContext } from "../../../utils/context/ForgotPasswordContext";
import { toastAlert } from "../../../utils/Alerts/toastAlert";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user } = useContext(ForgotPasswordContext);
  const [isAuth, setIsAuth] = useState(false);

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
    await axios
      .post("http://localhost:30000/api/admin/reset-password", {
        staffId: user.staffId,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          navigate("/", { replace: true });
          toastAlert("success", "Password Changed !");
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
            <div>
              <label>New Password: </label>
              <input
                type="text"
                name="new"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="block w-full  max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
            </div>
            <div>
              <label>Confirm New Password: </label>
              <input
                type="text"
                name="confirm"
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                }}
                className="block w-full max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
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
    </section>
  );
};

export default ResetPassword;
