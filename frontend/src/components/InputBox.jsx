import React from "react";

const InputBox = ({ type, label, options }) => {
  return (
    <div>
      <p className="text-md font-medium mb-2">{label}</p>
      <div className="relative text-black/50 focus-within:text-black">
        {type === "select" ? (
          <select
            id=""
            className="h-12 block w-[20rem] xl:w-[22rem] pr-4 pl-3 py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed"
          >
            <option value="" selected>
              Choose an option
            </option>
            {options &&
              options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            {/* <option selected>Choose a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option> */}
          </select>
        ) : (
          <input
            type={type}
            className="block w-[20rem] xl:w-[22rem] pr-4 pl-3 py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed "
          />
        )}
      </div>
    </div>
  );
};

export default InputBox;
