import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import UploadFIleInput from "../UploadFIleInput";
import InputBox from "../InputBox";
// import inputFields from "../../assets/sample_data/InputFields";

const AddReceipt = () => {
  const [inputFields, setInputFields] = useState([]);
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          "http://localhost:30000/api/receipt/get-fields"
        );
        // console.log(response);
        if (response.data.success) {
          setInputFields(response.data.fields);
        }
      } catch (error) {
        console.error("Error fetching fields", error);
      }
    };
    fetchFields();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:30000/api/receipt/create-receipt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      setFormData(new FormData()); // Reset FormData
      document.querySelector("form").reset();
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      formData.append(name, files[0]);
    } else {
      formData.append(name, value);
    }
    setFormData(formData);
  };

  return (
    <section>
      <Header page="Add Receipt" isDashboard={false} role={0} />
      <div className="w-[100] m-5 bg-white p-10 rounded-xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start gap-5"
        >
          {inputFields.map((field, index) =>
            field.fieldType === "file" ? (
              <UploadFIleInput
                key={index}
                label={field.fieldName}
                onChange={handleChange}
              />
            ) : (
              <InputBox
                key={index}
                type={field.fieldType}
                label={field.fieldName}
                onChange={handleChange}
              />
            )
          )}
          <div className="flex gap-5">
            <button
              type="submit"
              className="text-md rounded-md w-32 sm:w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
            >
              Add Receipt
            </button>
            <button
              type="button"
              className="text-md rounded-md w-32 sm:w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
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
