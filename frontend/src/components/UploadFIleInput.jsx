import React from "react";

const UploadFIleInput = ({ label, onChange, requiredField }) => {
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
            required={requiredField}
            onChange={onChange}
            className="ml-3"
          />
        </div>
      </label>
      <p className="text-sm mt-1">
        <span className="text-sm">Accepted file formats:-</span>{" "}
        <i className="font-medium text-gray-500">jpg, jpeg, png</i>
      </p>
    </div>
  );
};

export default UploadFIleInput;
