import React, { useCallback, useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
// import inputFields from "../../assets/sample_data/InputFields";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import InputBox from "../InputBox";
import crossIcon from "../../assets/icons/cross.svg";
import { sweetAlert } from "../../utils/Alerts/sweetAlert";
import { toastAlert } from "../../utils/Alerts/toastAlert";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ChangeForm = () => {
  const [inputFields, setInputFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [required, setRequired] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/receipt/get-fields`);
        // console.log(response);
        if (response.data.success) {
          setInputFields(response.data.fields);
          setIsLoading(false);
        }
      } catch (error) {
        // console.error("Error fetching fields", error);
        setIsLoading(false);
      }
    };

    // setDeleteButtonClicked(false);
    fetchFields();
  }, [deleteButtonClicked, addButtonClicked]);

  const handleDeleteButton = useCallback(async (name) => {
    sweetAlert(`Are you sure you want to delete the "${name}" field?`).then(
      (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          axios
            .post(`${backendUrl}/receipt/delete-field`, {
              fieldName: name,
            })
            .then((response) => {
              if (response.data.success) {
                setDeleteButtonClicked((prev) => !prev); // Toggle to trigger re-fetch
                // console.log(response.data.message);
                toastAlert("success", `"${name}" field is Deleted !`);
                setIsLoading(false);
              }
            })
            .catch((error) => {
              // console.error("Error deleting field", error);
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
        } else if (result.isDenied) {
        }
      }
    );
  }, []);

  // console.log("FieldName: ", fieldName);
  // console.log("FieldType: ", fieldType);
  // console.log("Required: ", required);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios
      .post(`${backendUrl}/receipt/add-field`, {
        fieldName: fieldName,
        fieldType: fieldType,
        required: required,
      })
      .then((response) => {
        if (response.data.success) {
          setAddButtonClicked((prev) => !prev); // Toggle to trigger re-fetch
          document.querySelector("form").reset(); // Reset the form fields
          // console.log(response.data.message);
          toastAlert("success", `"${fieldName}" field Added !`);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // console.error("Error adding field", error);
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

  return (
    <section>
      <Header page="Change Form" isDashboard={false} />
      <div className="w-[100] mt-12 sm:mt-5 m-5 bg-white p-10 flex flex-col xl:flex-row items-center sm:items-start gap-8 xl:gap-40 rounded-xl">
        {isLoading ? (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <div className="flex flex-col gap-4">
            {inputFields.map((field, index) => (
              <div
                key={index}
                className="flex gap-3 items-center w-[18rem] sm:w-[30rem] border-2 border-black rounded-md p-2"
              >
                <img
                  src={crossIcon}
                  alt=""
                  className="w-7 cursor-pointer"
                  onClick={() => {
                    handleDeleteButton(field.fieldName);
                  }}
                />
                <h3 className="text-lg font-semibold">{field.fieldName}</h3>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white w-[20rem] sm:w-[35rem] xl:w-[40rem] p-10 flex flex-col items-center rounded-xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <h3 className="text-lg font-medium mb-8">ADD NEW FIELD</h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[1.5rem] items-center"
          >
            <InputBox
              type="text"
              label="Field Name"
              requiredField={true}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <InputBox
              type="select"
              label="Field Type"
              requiredField={true}
              onChange={(e) => setFieldType(e.target.value)}
              options={[
                { label: "Text", value: "text" },
                { label: "Date", value: "date" },
                { label: "Time", value: "time" },
              ]}
            />
            <InputBox
              type="select"
              label="Required"
              requiredField={true}
              onChange={(e) => setRequired(e.target.value)}
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
            />
            <div className="flex gap-5">
              <button
                type="submit"
                className="text-md rounded-md w-32 sm:w-40 xl:w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
              >
                Add
              </button>
              <button
                type="button"
                className="text-md rounded-md w-32 sm:w-40 xl:w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
                onClick={() => document.querySelector("form").reset()} // Clears the form
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangeForm;
