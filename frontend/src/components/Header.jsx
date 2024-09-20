import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { json, Link, replace, useNavigate } from "react-router-dom";
import heart from "../assets/icons/white_heart.svg";
import home from "../assets/icons/home.svg";
import { AuthContext } from "../utils/context/AuthContext";

const Header = ({ page, isDashboard, role }) => {
  const { logout } = useContext(AuthContext);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to\nlog out?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/", { replace: true });

        toast.success("You have been logged out", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else if (result.isDenied) {
      }
    });
  };

  return (
    <div className="bg-[#BF3606] w-full h-20 flex justify-between items-center pl-16 pr-16 text-white relative">
      <div>
        <h2 className="text-sm sm:text-lg md:text-2xl font-bold">SL-TEACH</h2>
      </div>
      <div className="flex justify-between  w-32 md:w-40 items-center">
        {isDashboard ? (
          <Link to={"/favourites"}>
            <div className="flex flex-col items-center justify-center pt-3">
              <img src={heart} alt="" className="w-4 md:w-5" />
              <p className="text-[0.6rem] md:text-xs">Favourites</p>
            </div>
          </Link>
        ) : (
          <div>
            {currentUser.role === 1 ? (
              <Link to={"/admin-dashboard"}>
                <div className="flex flex-col items-center justify-center pt-3">
                  <img src={home} alt="" className="w-5 md:w-6" />
                  <p className="text-[0.6rem] md:text-xs">Home</p>
                </div>
              </Link>
            ) : (
              <Link to={"/staff-dashboard"}>
                <div className="flex flex-col items-center justify-center pt-3">
                  <img src={home} alt="" className="w-5 md:w-6" />
                  <p className="text-[0.6rem] md:text-xs">Home</p>
                </div>
              </Link>
            )}
          </div>
        )}

        <h2
          className="text-md md:text-xl font-semibold cursor-pointer"
          onClick={handleLogout}
        >
          LOGOUT
        </h2>
      </div>
      <div className="absolute top-20 sm:top-0 left-1/2 transform -translate-x-1/2 bg-[#F05924] px-8 pt-1 pb-2 rounded-br-lg rounded-bl-lg drop-shadow-lg ">
        <h2 className="text-lg tracking-wider text-center">{page}</h2>
      </div>
    </div>
  );
};

export default Header;
