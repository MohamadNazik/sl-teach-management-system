import React from "react";

const UploadFIleInput = ({ label }) => {
  return (
    <div>
      <p className="text-md font-medium mb-2">{label}</p>
      <label>
        <div className=" w-[28rem] h-11 rounded-md border border-black justify-between items-center inline-flex">
          <h2 className="text-black text-sm font-normal leading-snug pl-4">
            No file chosen
          </h2>
          <input type="file" hidden />
          <div
            className="flex w-28 h-11 px-2 flex-col bg-[#BF3606] rounded-md shadow text-white text-xs font-semibold leading-4 
                                             items-center justify-center cursor-pointer focus:outline-none"
          >
            UPLOAD
          </div>
        </div>
      </label>
    </div>
  );
};

export default UploadFIleInput;
