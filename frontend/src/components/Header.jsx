import React from "react";
import { Link } from "react-router-dom";
import heart from "../assets/icons/white_heart.svg";

const Header = () => {
  return (
    <div className="bg-[#BF3606] w-full h-20 flex justify-between items-center pl-16 pr-16 text-white">
      <div>
        <h2 className="text-sm sm:text-lg md:text-2xl font-bold">SL-TEACH</h2>
      </div>
      <div className="flex justify-between w-32 md:w-40 items-center">
        <div className="flex flex-col items-center justify-center pt-3">
          <img src={heart} alt="" className="w-4 md:w-5" />
          <p className="text-[0.6rem] md:text-xs">Favourites</p>
        </div>

        <Link to={"/"}>
          <h2 className="text-md md:text-xl font-semibold">LOGOUT</h2>
        </Link>
      </div>
    </div>
  );
};

export default Header;
