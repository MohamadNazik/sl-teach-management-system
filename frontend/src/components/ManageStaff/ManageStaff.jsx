import React, { useState } from "react";
import Modal from "react-modal";
import Header from "../Header";
import InputBox from "../InputBox";
import DataTable from "react-data-table-component";
import users from "../../assets/sample_data/users";

const customStylesForModal = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white", // Modal background color
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Backdrop color
  },
};

const customStyles = {
  cells: {
    style: {
      fontSize: "0.75rem",
    },
  },
  header: {
    style: {
      backgroundColor: "#BF3606", // Default header background color
    },
  },
  headCells: {
    style: {
      backgroundColor: "#F05924", // Header background color
      "&:hover": {
        backgroundColor: "#BF3606",
        color: "white", // Hover effect on header cells
      },
      color: "white",
      fontWeight: "500",
      fontSize: "0.8rem",
    },
  },
};

const ManageStaff = () => {
  const [addNewClicked, setAddNewClicked] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState({});

  function openEditModal(receipt) {
    setCurrentReceipt(receipt);
    setEditModalIsOpen(true);
  }

  function closeEditModal() {
    setEditModalIsOpen(false);
  }

  const handleClick = () => {
    setAddNewClicked((prevState) => !prevState);
  };

  const columns = [
    {
      name: "Staff ID",
      selector: (row) => row.staffId,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Password",
      selector: (row) => row.password,
    },
    // {
    //   name: "Role",
    //   selector: (row) => row.role,
    //   // sortable: true,
    // },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="ml-3 text-md font-medium bg-green-700 px-3 py-2 text-white rounded-md hover:bg-green-900"
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          <button className="ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md hover:bg-red-900">
            Delete
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];
  return (
    <section>
      <Header page="Manage Staff" isDashboard={false} />
      <div className="w-[100] m-5 bg-white p-10 flex flex-col xl:flex-row items-start gap-8 xl:gap-40 rounded-xl">
        <div className="flex flex-col gap-4 rounded-xl">
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

        {/* Edit modal */}

        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          style={customStylesForModal}
          contentLabel="Edit Receipt"
        >
          <h2 className="text-xl font-bold text-start mb-4 text-[#BF3606]">
            Edit Staff
          </h2>
          <div className="w-[20rem] sm:w-[40rem] h-[25rem] sm:h-[24rem] overflow-auto flex flex-col gap-3 items-start mb-4">
            <form className="flex flex-col gap-2 w-[20rem] sm:w-[38rem]">
              {Object.entries(currentReceipt).map(
                ([key, value], index) =>
                  key !== "role" && ( // Skip if the key is "role"
                    <div key={index} className="mb-4">
                      <label
                        htmlFor={key}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        id={key}
                        name={key}
                        type="text"
                        value={value}
                        onChange={(e) => {
                          setCurrentReceipt((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  )
              )}
              <div>
                <button
                  type="submit"
                  className="w-20  text-md font-medium bg-green-700 px-3 py-2 text-white rounded-md hover:bg-green-900"
                >
                  Save
                </button>

                <button
                  onClick={closeEditModal}
                  className="w-20 ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md hover:bg-red-900"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </Modal>

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
