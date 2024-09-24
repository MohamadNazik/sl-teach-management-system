import React from "react";

const InputBox = ({ type, label, options, onChange, requiredField }) => {
  const formatString = (str) => {
    // Remove all white spaces and make the first letter lowercase
    if (str) {
      const noSpaces = str.trim().replace(/\s+/g, ""); // Remove all spaces
      return noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
    }
  };

  const fieldValue = formatString(label);
  return (
    <div>
      <p className="text-md font-medium mb-2">
        {label === "price" ? "Euro(price)" : label}
      </p>
      <div className="relative text-black/50 focus-within:text-black">
        {type === "select" ? (
          <select
            id=""
            name={label}
            required={requiredField}
            onChange={onChange}
            className="h-12 block w-[19rem] sm:w-[30rem] pr-4 pl-3 py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed"
          >
            <option value="">Choose an option</option>
            {options &&
              options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        ) : (
          <input
            type={type}
            name={label}
            required={requiredField}
            onChange={onChange}
            className="block w-[19rem] sm:w-[30rem]  pr-4 pl-3 py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed "
          />
        )}
      </div>
    </div>
  );
};

export default InputBox;
