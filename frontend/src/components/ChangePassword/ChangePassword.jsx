import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../utils/context/AuthContext";
import { toastAlert } from "../../utils/Alerts/toastAlert";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { currentUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = currentUser.id;

    await axios
      .put(`http://localhost:30000/api/auth/change-password/${id}`, {
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
            <div>
              <label> Old Password: </label>
              <input
                type="text"
                name="old"
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                className="block w-full  max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
            </div>
            <div>
              <label> New Password: </label>
              <input
                type="text"
                name="new"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="block w-full max-w-xs px-4  py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed tracking-wider"
                placeholder=""
                required
              />
            </div>
            <div>
              <label> Confirm New Password: </label>
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

          <button className="text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white">
            CHANGE PASSWORD
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
