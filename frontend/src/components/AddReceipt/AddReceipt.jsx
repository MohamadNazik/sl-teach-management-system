import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import UploadFIleInput from "../UploadFIleInput";
import InputBox from "../InputBox";
import { toastAlert } from "../../utils/Alerts/toastAlert";
// import inputFields from "../../assets/sample_data/InputFields";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddReceipt = () => {
  const [inputFields, setInputFields] = useState([]);
  const [formData, setFormData] = useState(new FormData());

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      setIsLoading(true);
      await axios
        .get(`${backendUrl}/receipt/get-fields`)
        .then((response) => {
          // console.log(response);
          if (response.data.success) {
            setInputFields(response.data.fields);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          // console.error("Error fetching fields", error);
          if (error.response) {
            // Handle invalid credentials
            toastAlert("error", error.response.data.message);
            setIsLoading(false);
          } else {
            // Handle server or network error
            toastAlert("error", "Server Error!");
            setIsLoading(false);
          }
        });
    };
    fetchFields();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`${backendUrl}/receipt/create-receipt`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // console.log("Response:", response.data);
        toastAlert("success", "Receipt Added !");
        setFormData(new FormData()); // Reset FormData
        document.querySelector("form").reset(); // Reset the form fields
      })
      .catch((error) => {
        // console.error("Error submitting form", error);
        if (error.response) {
          // Handle invalid credentials
          toastAlert("error", error.response.data.message);
        } else {
          // Handle server or network error
          toastAlert("error", "Server Error!");
        }
      });
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
    <section className="flex flex-col items-center">
      <Header page="Add Receipt" isDashboard={false} role={0} />

      {isLoading ? (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="w-full sm:w-[100] m-5 mt-12 sm:mt-4 bg-white p-10 rounded-xl flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center md:items-start gap-5"
          >
            {inputFields.map((field, index) =>
              field.fieldType === "file" ? (
                <UploadFIleInput
                  key={index}
                  label={field.fieldName}
                  requiredField={field.required}
                  onChange={handleChange}
                />
              ) : (
                <InputBox
                  key={index}
                  type={field.fieldType}
                  label={field.fieldName}
                  requiredField={field.required}
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
      )}
    </section>
  );
};

export default AddReceipt;
