import React from "react";

const UploadFIleInput = ({ label, onChange }) => {
  // const formatString = (str) => {
  //   // Remove all white spaces and make the first letter lowercase
  //   const noSpaces = str.trim().replace(/\s+/g, ""); // Remove all spaces
  //   return noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
  // };

  // const fieldValue = formatString(label);
  return (
    <div>
      <p className="text-md font-medium mb-2">{label}</p>
      <label>
        <div className="w-[19rem] sm:w-[30rem] h-11 rounded-md border border-black justify-between items-center inline-flex">
          <input
            type="file"
            name={label}
            onChange={onChange}
            className="ml-3"
          />
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
