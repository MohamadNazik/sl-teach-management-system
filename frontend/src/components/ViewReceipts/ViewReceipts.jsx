import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Header from "../Header";
import DataTable from "react-data-table-component";
import receipts from "../../assets/sample_data/Receipts";

import lineHeart from "../../assets/icons/lineheart.svg";
import redFillHeart from "../../assets/icons/redfillheart.svg";

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

const ViewReceipts = () => {
  const [records, setRecords] = useState(receipts);
  const [receipt, setReceipt] = useState(null);
  const [viewModalIsOpen, setviewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState({});
  const [resData, setResData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:30000/api/receipt/get-receipts"
        );

        // console.log(response);

        setResData(response.data.result);

        // Generate columns based on data
        const columns = Object.keys(response.data.result[0].fields || {})
          .filter((key) => {
            const value = response.data.result[0].fields[key];
            return typeof value !== "object" || !value.path;
          })
          .map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
            selector: (row) => row.fields[key],
            sortable: true,
            field: key,
          }));

        // Add custom columns for'Actions'
        columns.push({
          name: "Actions",
          cell: (row) => (
            <>
              <button
                className="text-md font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
                onClick={() => openViewReceiptModal(row)}
              >
                View
              </button>
              <button
                className="ml-3 text-md font-medium bg-green-700 px-3 py-2 text-white rounded-md hover:bg-green-900"
                onClick={() => openEditModal(row)}
              >
                Edit
              </button>
              <button className="ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md hover:bg-red-900">
                Delete
              </button>

              <div>
                <img
                  src={lineHeart}
                  alt=""
                  className="ml-3 w-5 cursor-pointer"
                />
              </div>
            </>
          ),
          width: "250px",
        });

        setColumns(columns);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [resData]);

  function openViewReceiptModal(receipt) {
    setCurrentReceipt(receipt);
    setviewModalIsOpen(true);
  }

  function closeViewModal() {
    setviewModalIsOpen(false);
  }

  function openEditModal(receipt) {
    setCurrentReceipt(receipt);
    setEditModalIsOpen(true);
  }

  function closeEditModal() {
    setEditModalIsOpen(false);
  }

  // const columns = [
  //   ...Object.keys(receipts[0]).map((key) => {
  //     return {
  //       name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
  //       selector: (row) => row[key], // Access the dynamic key
  //       sortable: true,
  //       field: key, // Add field key for reference
  //     };
  //   }),
  //   {
  //     name: "Actions",
  //     cell: (row) => (
  //       <>
  //         <button
  //           className="text-md font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
  //           onClick={() => openViewReceiptModal(row)}
  //         >
  //           View
  //         </button>
  //         <button
  //           className="ml-3 text-md font-medium bg-green-700 px-3 py-2 text-white rounded-md hover:bg-green-900"
  //           onClick={() => openEditModal(row)}
  //         >
  //           Edit
  //         </button>
  //         <button className="ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md hover:bg-red-900">
  //           Delete
  //         </button>

  //         <div>
  //           <img src={lineHeart} alt="" className="ml-3 w-5 cursor-pointer" />
  //         </div>
  //       </>
  //     ),
  //     width: "250px",
  //   },
  // ];

  const isFile = (value) => {
    // Check common file extensions for images, PDFs, or any file types
    return (
      value.endsWith(".jpg") ||
      value.endsWith(".png") ||
      value.endsWith(".jpeg") ||
      value.endsWith(".pdf")
    );
  };

  const renderFile = (value, key) => {
    if (
      value.endsWith(".jpg") ||
      value.endsWith(".png") ||
      value.endsWith(".jpeg")
    ) {
      // Render image files
      return (
        <img
          src={value}
          alt={key}
          style={{ width: "100px", height: "100px" }}
        />
      );
    } else if (value.endsWith(".pdf")) {
      // Render PDF file as a link or embed
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
        >
          View PDF
        </a>
      );
    } else {
      // For any other file types, provide a download link
      return (
        <a
          href={value}
          download
          className="text-xs font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
        >
          Download File
        </a>
      );
    }
  };

  // const handleChange = (field, e) => {
  //   let query = e.target.value; // Get the value from the input field
  //   const newRecords = receipts.filter(
  //     (item) =>
  //       item[field]?.toLocaleLowerCase().includes(query.toLocaleLowerCase()) // Use the field parameter
  //   );
  //   setRecords(newRecords); // Update the state with the filtered records
  // };

  return (
    <section>
      <Header page="View Receipts" isDashboard={false} />

      {/* <div className="w-[100] m-5 bg-white p-2 rounded-xl">
        <div>
          {columns.map((col, index) => (
            <input
              key={index}
              className="block w-[28rem] pr-4 pl-3 py-2 text-md font-normal shadow-xs text-black bg-transparent border border-black rounded-md placeholder-black/50 focus:outline-none leading-relaxed"
              type="text"
              placeholder={`Search By ${col.name}`}
              onChange={(e) => handleChange(col.field, e)} // Use col.field for correct field name
            />
          ))}
        </div>
      </div> */}
      <div className="w-[100] m-5 bg-white p-2 rounded-xl">
        <DataTable
          columns={columns}
          data={resData}
          customStyles={customStyles}
          pagination
          paginationRowsPerPageOptions={[50, 100, 200, 500, 1000, 1500]} // Custom dropdown valuess
          paginationPerPage={50}
        />
        {/* {console.log("Columns : ", columns)} */}
      </div>

      {/* View modal */}

      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        style={customStylesForModal}
        contentLabel="Receipt Details"
      >
        <h2 className="text-xl font-bold text-start mb-4 text-[#BF3606]">
          View Receipt Detils
        </h2>
        <div className="w-[20rem] sm:w-[40rem] h-[30rem] overflow-auto flex flex-col gap-3 items-start mb-4">
          {console.log(resData)}
          {currentReceipt && currentReceipt.fields && (
            <>
              {Object.entries(currentReceipt.fields) // Access `fields` from currentReceipt
                .filter(
                  ([key, value]) => typeof value !== "object" || !value.path
                ) // Skip object fields with path
                .map(([key, value], index) => (
                  <div
                    key={index}
                    className="sm:w-[35rem] flex items-center justify-start p-2 pl-0 gap-2 text-md font-medium"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                    {typeof value === "string" && isFile(value) ? (
                      renderFile(value, key) // Render file (image or other)
                    ) : (
                      <h3 className="text-sm font-normal">{value}</h3> // Render normal value
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      </Modal>

      {/* Edit modal */}

      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        style={customStylesForModal}
        contentLabel="Edit Receipt"
      >
        <h2 className="text-xl font-bold text-start mb-4 text-[#BF3606]">
          Edit Receipt
        </h2>
        <div className="w-[20rem] sm:w-[40rem] h-[30rem] overflow-auto flex flex-col gap-3 items-start mb-4">
          <form className="flex flex-col gap-2 w-[20rem] sm:w-[38rem]">
            {Object.entries(currentReceipt).map(([key, value], index) => (
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
            ))}
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
    </section>
  );
};

export default ViewReceipts;
