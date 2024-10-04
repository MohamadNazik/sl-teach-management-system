import React, { useContext, useEffect, useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../utils/context/AuthContext";
import logo from "../../assets/logos/SL Teach Logo.jpg";

import "react-toastify/dist/ReactToastify.css";
import { toastAlert } from "../../utils/Alerts/toastAlert";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [isHide, setIsHide] = useState(true);
  const { currentUser, login } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 1) {
        navigate("/admin-dashboard", { replace: true });
        toastAlert("success", `Already logged in as ${currentUser.name}`);
      } else if (currentUser.role === 0) {
        navigate("/staff-dashboard", { replace: true });
        toastAlert("success", `Already logged in as ${currentUser.name}`);
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setIsLoading(true);
      await axios
        .post(`${backendUrl}/admin/admin-login`, {
          staffId,
          password,
        })
        .then((response) => {
          // console.log(response);

          if (response.data.success) {
            const { user } = response.data;
            login(user);
            setIsLoading(false);

            if (user.role === 1) {
              navigate("/admin-dashboard", { replace: true });
              toastAlert("success", `Successfully logged in as ${user.name}`);
            } else if (user.role === 0) {
              navigate("/staff-dashboard", { replace: true });
              toastAlert("success", `Successfully logged in as ${user.name}`);
            } else {
              navigate("/");
            }
          } else {
            toastAlert("error", response.data.message);
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
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-[url('/src/assets/background/login.png')] bg-cover">
      <div className="w-96 flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-36 rounded-3xl" />
          {/* <h1 className="text-center font-bold text-3xl mb-3 text-white tracking-[0.15em]">
            SL TEACH
          </h1> */}
          <h3 className="text-center font-medium text-xl text-white tracking-wide mt-5">
            Receipt Management System
          </h3>
        </div>
        <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
          <div className="relative text-white/50 focus-within:text-white">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current ml-1"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="block w-full max-w-xs pr-4 pl-12 py-2 text-md font-normal shadow-xs text-white bg-transparent border border-white rounded-md placeholder-white/50 focus:outline-none leading-relaxed tracking-wider"
              placeholder="STAFF ID"
              required
            />
          </div>
          <div className="relative text-white/50 focus-within:text-white">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 25 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current ml-1"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></rect>
                  <path
                    d="M7 10.9999V6.99988C7 4.23845 9.23858 1.99988 12 1.99988V1.99988C14.7614 1.99988 17 4.23845 17 6.99988V10.9999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
            <input
              type={isHide ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full max-w-xs pr-4 pl-12 py-2 text-md font-normal shadow-xs text-white bg-transparent border border-white rounded-md placeholder-white/50 focus:outline-none leading-relaxed tracking-wider"
              placeholder="PASSWORD"
              required
            />
            <div
              className="text-white text-xl absolute right-4 top-3 cursor-pointer"
              onClick={() => {
                setIsHide((prev) => !prev);
              }}
            >
              {isHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
            </div>
          </div>

          <button
            type="submit"
            className="text-md rounded-md w-80 pl-6 pr-6 pt-2 pb-2 bg-white mt-8 font-semibold text-[#BF3606]"
          >
            LOGIN
          </button>
          <div className="w-full flex justify-center mt-3">
            <Link to={"/forgot-password"}>
              <p className="text-sm text-white/75 hover:text-white hover:scale-105 cursor-pointer transition-all ease-in-out duration-300">
                Forgot password? click here
              </p>
            </Link>
          </div>
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

export default LoginPage;
