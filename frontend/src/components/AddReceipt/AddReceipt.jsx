import React from "react";
import Header from "../Header";
import UploadFIleInput from "../UploadFIleInput";
import InputBox from "../InputBox";
import inputFields from "../../assets/sample_data/InputFields";

const AddReceipt = () => {
  return (
    <section>
      <Header page="Add Receipt" isDashboard={false} />
      <div className="w-[100] m-5 bg-white p-10 rounded-xl">
        <form action="" className="flex flex-col items-start gap-5">
          {inputFields.map((field, index) =>
            field.type === "file" ? (
              <UploadFIleInput key={index} label={field.label} />
            ) : (
              <InputBox key={index} type={field.type} label={field.label} />
            )
          )}
          <div className="flex gap-5">
            <button
              type="submit"
              className="text-md rounded-md w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
            >
              Add Receipt
            </button>
            <button
              type="button"
              className="text-md rounded-md w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
              onClick={() => document.querySelector("form").reset()}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddReceipt;
