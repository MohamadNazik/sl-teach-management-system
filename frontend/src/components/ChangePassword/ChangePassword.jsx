import React, { useContext, useEffect, useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../utils/context/AuthContext";
import { toastAlert } from "../../utils/Alerts/toastAlert";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isOldHide, setIsOldHide] = useState(true);
  const [isNewHide, setIsNewHide] = useState(true);
  const [isConfirmHide, setIsConfirmHide] = useState(true);

  const { currentUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = currentUser.id;

    await axios
      .put(`${backendUrl}/auth/change-password/${id}`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          logout();
          navigate("/", { replace: true });
          toastAlert("info", "You have to log in again !");
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
          Change Password
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-[30rem] flex flex-col items-center"
        >
          <div className="mt-10 w-[20rem] flex flex-col gap-3">
            <div className="relative">
              <label> Old Password: </label>
              <input
                type={isOldHide ? "password" : "text"}
                name="old"
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                className="block w-full  max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
              <div
                className="text-black/75 text-xl absolute right-4 top-9 cursor-pointer"
                onClick={() => {
                  setIsOldHide((prev) => !prev);
                }}
              >
                {isOldHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>
            <div className="relative">
              <label> New Password: </label>
              <input
                type={isNewHide ? "password" : "text"}
                name="new"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="block w-full max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
              <div
                className="text-black/75 text-xl absolute right-4 top-9 cursor-pointer"
                onClick={() => {
                  setIsNewHide((prev) => !prev);
                }}
              >
                {isNewHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>
            <div className="relative">
              <label> Confirm New Password: </label>
              <input
                type={isConfirmHide ? "password" : "text"}
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
                  setIsConfirmHide((prev) => !prev);
                }}
              >
                {isConfirmHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>
          </div>

          <button className="text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white">
            CHANGE PASSWORD
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
