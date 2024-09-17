import React, { useState } from "react";
import Header from "../Header";
import inputFields from "../../assets/sample_data/InputFields";
import InputBox from "../InputBox";
import crossIcon from "../../assets/icons/cross.svg";

const ChangeForm = () => {
  const [addNewClicked, setAddNewClicked] = useState(false);
  const handleClick = () => {
    setAddNewClicked((prevState) => !prevState);
  };
  return (
    <section>
      <Header page="Change Form" isDashboard={false} />
      <div className="w-[100] m-5 bg-white p-10 flex flex-col xl:flex-row items-start gap-8 xl:gap-40 rounded-xl">
        <div className="flex flex-col gap-4">
          {inputFields.map((field, index) => (
            <div className="flex gap-3 items-center w-[30rem] border-2 border-black rounded-md p-2">
              <img src={crossIcon} alt="" className="w-7 cursor-pointer" />
              <h3 className="text-lg font-semibold">{field.label}</h3>
            </div>
          ))}
        </div>
        <div className="bg-white w-[25rem] xl:w-[40rem] p-10 flex flex-col items-center rounded-xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <h3 className="text-lg font-medium mb-8">ADD NEW FIELD</h3>
          <form action="" className="flex flex-col gap-[1.5rem] items-center">
            <InputBox type="text" label="Label" />
            <InputBox
              type="select"
              label="Type"
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
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
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

        {/* <button
          className="text-md rounded-md w-52 ml-[8rem] pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
          onClick={handleClick}
        >
          Add New
        </button> */}
      </div>
    </section>
  );
};

export default ChangeForm;

// {
//   addNewClicked ? (
//     <div className="bg-white w-[40rem] p-10 flex flex-col items-center rounded-xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)] absolute bottom-10 left-[35rem]">
//       <form action="" className="flex flex-col gap-[1.5rem] items-center">
//         <InputBox type="text" label="Label" />
//         <InputBox
//           type="select"
//           label="Type"
//           options={[
//             { label: "Text", value: "text" },
//             { label: "Date", value: "date" },
//             { label: "Time", value: "time" },
//             { label: "File", value: "file" },
//           ]}
//         />
//         {/* <InputBox
//               type="select"
//               label="Required"
//               options={[
//                 { label: "True", value: "true" },
//                 { label: "False", value: "false" },
//               ]}
//             /> */}
//         <div className="flex gap-5">
//           <button
//             type="submit"
//             className="text-md rounded-md w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
//           >
//             Add
//           </button>
//           <button
//             type="button"
//             className="text-md rounded-md w-52 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] mt-8 font-semibold text-white"
//             onClick={() => document.querySelector("form").reset()} // Clears the form
//           >
//             Clear
//           </button>
//         </div>
//       </form>
//     </div>
//   ) : null;
// }
