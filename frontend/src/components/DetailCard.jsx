import React from "react";

const DetailCard = ({ icon, title }) => {
  return (
    <div className="w-40 h-52 md:w-60 md:h-72 bg-white rounded-xl flex flex-col items-center justify-center drop-shadow-lg">
      <img src={icon} alt="" className="w-48" />
      <h3 className="text-md  md:text-xl font-semibold text-[#080f72] uppercase">
        {title}
      </h3>
    </div>
  );
};

export default DetailCard;
