import React, { useCallback, useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
// import inputFields from "../../assets/sample_data/InputFields";
import InputBox from "../InputBox";
import crossIcon from "../../assets/icons/cross.svg";

const ChangeForm = () => {
  const [inputFields, setInputFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [required, setRequired] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);

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

    // setDeleteButtonClicked(false);
    fetchFields();
  }, [deleteButtonClicked, addButtonClicked]);

  const handleDeleteButton = useCallback(async (name) => {
    try {
      const response = await axios.post(
        "http://localhost:30000/api/receipt/delete-field",
        { fieldName: name }
      );
      if (response.data.success) {
        setDeleteButtonClicked((prev) => !prev); // Toggle to trigger re-fetch
        // console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting field", error);
    }
  }, []);

  // console.log("FieldName: ", fieldName);
  // console.log("FieldType: ", fieldType);
  // console.log("Required: ", required);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:30000/api/receipt/add-field",
        { fieldName: fieldName, fieldType: fieldType, required: required }
      );
      if (response.data.success) {
        setAddButtonClicked((prev) => !prev); // Toggle to trigger re-fetch
        document.querySelector("form").reset();
        // console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting field", error);
    }
  };

  return (
    <section>
      <Header page="Change Form" isDashboard={false} />
      <div className="w-[100] m-5 bg-white p-10 flex flex-col xl:flex-row items-start gap-8 xl:gap-40 rounded-xl">
        <div className="flex flex-col gap-4">
          {inputFields.map((field, index) => (
            <div className="flex gap-3 items-center w-[30rem] border-2 border-black rounded-md p-2">
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
        <div className="bg-white w-[25rem] xl:w-[40rem] p-10 flex flex-col items-center rounded-xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
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
                { label: "File", value: "file" },
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
                className="text-md rounded-md w-40 xl:w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
              >
                Add
              </button>
              <button
                type="button"
                className="text-md rounded-md w-40 xl:w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
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
