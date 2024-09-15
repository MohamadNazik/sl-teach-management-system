import React from "react";
import { Link } from "react-router-dom";
import heart from "../assets/icons/white_heart.svg";
import home from "../assets/icons/home.svg";

const Header = ({ page, isDashboard }) => {
  return (
    <div className="bg-[#BF3606] w-full h-20 flex justify-between items-center pl-16 pr-16 text-white relative">
      <div>
        <h2 className="text-sm sm:text-lg md:text-2xl font-bold">SL-TEACH</h2>
      </div>
      <div className="flex justify-between  w-32 md:w-40 items-center">
        {isDashboard ? (
          <div className="flex flex-col items-center justify-center pt-3">
            <img src={heart} alt="" className="w-4 md:w-5" />
            <p className="text-[0.6rem] md:text-xs">Favourites</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-3">
            <img src={home} alt="" className="w-5 md:w-6" />
            <p className="text-[0.6rem] md:text-xs">Home</p>
          </div>
        )}

        <Link to={"/"}>
          <h2 className="text-md md:text-xl font-semibold">LOGOUT</h2>
        </Link>
      </div>
      <div className="absolute top-20 sm:top-0 left-1/2 transform -translate-x-1/2 bg-[#F05924] px-8 pt-1 pb-2 rounded-br-lg rounded-bl-lg drop-shadow-lg ">
        <h2 className="text-lg tracking-wider text-center">{page}</h2>
      </div>
    </div>
  );
};

export default Header;
