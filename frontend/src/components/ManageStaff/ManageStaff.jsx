import React, { useState } from "react";
import Header from "../Header";
import InputBox from "../InputBox";
import DataTable from "react-data-table-component";
import users from "../../assets/sample_data/users";

const columns = [
  {
    name: "Staff ID",
    selector: (row) => row.staffId,
    // sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    // sortable: true,
  },
  {
    name: "Password",
    selector: (row) => row.password,
  },
  {
    name: "Role",
    selector: (row) => row.role,
    // sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => (
      <>
        <button className="ml-3 text-md font-medium bg-green-700 px-3 py-2 text-white rounded-md">
          Edit
        </button>
        <button className="ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md">
          Delete
        </button>
      </>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "140px",
  },
];

const customStyles = {
  headCells: {
    style: {
      color: "black",
      fontWeight: "700",
      fontSize: "1.15rem",
    },
  },
  cells: {
    style: {
      fontSize: "0.9rem",
    },
  },
};

const ManageStaff = () => {
  const [addNewClicked, setAddNewClicked] = useState(false);
  const handleClick = () => {
    setAddNewClicked((prevState) => !prevState);
  };
  return (
    <section>
      <Header page="Manage Staff" isDashboard={false} />
      <div className="w-[100] m-5 bg-white p-10 flex flex-col xl:flex-row items-start gap-8 xl:gap-40 rounded-xl">
        <div className="flex flex-col gap-4">
          <DataTable
            columns={columns}
            data={users} // Using the imported dataset
            pagination
            customStyles={customStyles}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25]} // Custom dropdown valuess
            paginationPerPage={10}
          />
        </div>
        <div className="bg-white w-[25rem] lg:w-[40rem] p-10 flex flex-col items-center rounded-xl drop-shadow-xl">
          <h3 className="text-lg font-medium mb-8">ADD NEW STAFF</h3>
          <form action="" className="flex flex-col gap-[1.5rem] items-center">
            <InputBox type="text" label="Name" />
            <InputBox type="text" label="Staff ID" />
            <InputBox type="text" label="Password" />

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

export default ManageStaff;
