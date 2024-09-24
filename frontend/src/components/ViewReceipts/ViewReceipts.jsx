import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Header from "../Header";
import DataTable from "react-data-table-component";
// import receipts from "../../assets/sample_data/Receipts";

import lineHeart from "../../assets/icons/lineheart.svg";
import redFillHeart from "../../assets/icons/redfillheart.svg";
import { sweetAlert } from "../../utils/Alerts/sweetAlert";
import { toastAlert } from "../../utils/Alerts/toastAlert";
import { AuthContext } from "../../utils/context/AuthContext";

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
      fontSize: "0.8rem",
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
      fontSize: "0.9rem",
    },
  },
  // rows: {
  //   style: (row) => ({
  //     backgroundColor: row.fields.color || "transparent", // Use the color from the data or default to transparent
  //     color: "white",
  //     padding: "0.75rem",
  //     "&:hover": {
  //       backgroundColor: row.fields.color || "#F1F1F1", // Keep hover color as the original row color or default
  //     },
  //   }),
  // },
};

const ViewReceipts = () => {
  // const [records, setRecords] = useState(receipts);
  // const [receipt, setReceipt] = useState(null);
  const [viewModalIsOpen, setviewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState({});
  const [resData, setResData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [favoriteReceipts, setFavoriteReceipts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("http://localhost:30000/api/receipt/get-receipts")
        .then((response) => {
          // console.log(response);

          setResData(response.data.result);

          // Generate columns based on data
          const columns = Object.keys(response.data.result[0].fields || {}).map(
            (key) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
              selector: (row) => {
                const value = row.fields[key];
                // Handle cases where the value is an object (like for "Upload Image")
                if (typeof value === "object" && value !== null && value.path) {
                  return <p>{value.name}</p>;
                }
                return value;
              },
              sortable: true,
              field: key,
            })
          );

          // Add custom columns for 'Actions'
          columns.push({
            name: "Colors",
            cell: (row) => (
              <div className="block w-full">
                <select
                  id=""
                  className="h-9 border border-gray-300 text-gray-600 text-sm rounded-lg block w-28 py-0.5 px-1 focus:outline-none"
                >
                  <option>color</option>
                  <option value="" className="text-red-600 font-bold">
                    Red
                  </option>
                  <option value="" className="text-blue-600 font-bold">
                    Blue
                  </option>
                  <option value="" className="text-green-600 font-bold">
                    Green
                  </option>
                  <option value="" className="text-yellow-600 font-bold">
                    Yellow
                  </option>
                  <option value="" className="text-orange-600 font-bold">
                    Orange
                  </option>
                  <option value="" className="text-gray-600 font-bold">
                    Gray
                  </option>
                </select>
              </div>
            ),

            width: "150px",
          });

          columns.push({
            name: "Actions",
            cell: (row) => (
              <>
                <div>
                  <img
                    src={
                      favoriteReceipts.includes(row._id)
                        ? redFillHeart
                        : lineHeart
                    }
                    alt=""
                    className="w-5 cursor-pointer"
                    onClick={() => toggleFavorite(row._id, currentUser)}
                  />
                </div>

                <button
                  className="ml-3 text-md font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
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
                <button
                  className="ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md hover:bg-red-900"
                  onClick={() => handleDeleteButton(row)}
                >
                  Delete
                </button>
              </>
            ),

            width: "250px",
          });

          setColumns(columns);
        })
        .catch((error) => {
          // console.error("Error fetching data:", error);
          if (error.response && error.response.status === 404) {
            // Handle error response from the server
            toastAlert("error", error.response.data.message);
          } else {
            // Handle server or network error
            toastAlert("error", error.response.data.message);
          }
        });
    };

    setDeleteButtonClicked(false);

    fetchData();
  }, [editModalIsOpen, deleteButtonClicked, currentUser, favoriteReceipts]);

  useEffect(() => {
    const fetchFavoriteReceipts = async () => {
      if (currentUser) {
        await axios
          .get(
            `http://localhost:30000/api/receipt/get-favourite/${currentUser.id}`
          )
          .then((favoritesResponse) => {
            setFavoriteReceipts(
              favoritesResponse.data.data.map((fav) => fav._id)
            );
          })
          .catch((error) => {
            // console.error("Error fetching favorite receipts:", error);
            if (error.response && error.response.status === 404) {
              setFavoriteReceipts([]);
            } else {
              toastAlert("error", error.response.data.message);
            }
          });
      }
    };

    fetchFavoriteReceipts();
  }, [currentUser]);

  const toggleFavorite = async (receiptId, currentUser) => {
    try {
      const userId = currentUser.id;

      if (favoriteReceipts.includes(receiptId)) {
        // Remove from favorites
        await axios
          .post("http://localhost:30000/api/receipt/remove-favourite", {
            userId: userId,
            recieptId: receiptId,
          })
          .then((response) => {
            // console.log(response);
            if (response.data.success) {
              setFavoriteReceipts(
                favoriteReceipts.filter((id) => id !== receiptId)
              );
              toastAlert("success", "Removed from favorites");
            }
          })
          .catch((error) => {
            // console.error("Error fetching data:", error);
            if (error.response && error.response.status === 404) {
              // Handle error response from the server
              toastAlert("error", error.response.data.message);
            } else {
              // Handle server or network error
              toastAlert("error", error.response.data.message);
            }
          });
      } else {
        // Add to favorites
        await axios
          .post("http://localhost:30000/api/receipt/add-favourite", {
            userId: userId,
            recieptId: receiptId,
          })
          .then((response) => {
            // console.log(response);
            if (response.data.success) {
              setFavoriteReceipts([...favoriteReceipts, receiptId]);
              toastAlert("success", "Added to favorites");
            }
          })
          .catch((error) => {
            // console.error("Error fetching data:", error);
            if (error.response && error.response.status === 404) {
              // Handle error response from the server
              toastAlert("error", error.response.data.message);
            } else {
              // Handle server or network error
              toastAlert("error", error.response.data.message);
            }
          });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toastAlert("error", error.response.data.message);
      } else {
        toastAlert("error", error.response.data.message);
      }
    }
  };

  useEffect(() => {}, [resData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = currentReceipt._id;
    // console.log(id);
    try {
      const response = await axios.post(
        `http://localhost:30000/api/receipt/update-receipt/${id}`,
        currentReceipt.fields,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Response:", response.data);
      // document.querySelector("form").reset();
      if (response.data.success) {
        setEditModalIsOpen(false);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setCurrentReceipt((prevReceipt) => ({
      ...prevReceipt,
      fields: {
        ...prevReceipt.fields,
        [name]: type === "file" ? files[0] : value, // Handle file input
      },
    }));
  };

  const handleDeleteButton = async (receipt) => {
    const id = receipt._id;
    console.log(receipt);
    sweetAlert("Are you sure you want to delete the receipt?").then(
      (result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:30000/api/receipt/delete-receipt/${id}`)
            .then((response) => {
              // console.log("Response:", response.data);
              if (response.data.success) {
                setDeleteButtonClicked(true);
                toastAlert("success", "Receipt Deleted !");
                // console.log(response.data.message);
              }
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
        } else if (result.isDenied) {
        }
      }
    );
    // try {
    //   const response = await axios.delete(
    //     `http://localhost:30000/api/receipt/delete-receipt/${id}`
    //   );
    //   // console.log("Response:", response.data);
    //   if (response.data.success) {
    //     setDeleteButtonClicked(true);
    //     // console.log(response.data.message);
    //   }
    // } catch (error) {
    //   console.error("Error submitting form", error);
    // }
  };

  function openViewReceiptModal(receipt) {
    setCurrentReceipt(receipt);
    setviewModalIsOpen(true);
  }

  function closeViewModal() {
    setviewModalIsOpen(false);
    setCurrentReceipt({});
  }

  function openEditModal(receipt) {
    setCurrentReceipt(receipt);
    setEditModalIsOpen(true);
  }

  function closeEditModal() {
    setEditModalIsOpen(false);
  }

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
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold text-start mb-4 text-[#BF3606]">
          View Receipt Details
        </h2>
        <div className="w-[20rem] sm:w-[40rem] h-[30rem] overflow-auto flex flex-col gap-3 items-start mb-4">
          {currentReceipt && currentReceipt.fields && (
            <>
              {Object.entries(currentReceipt.fields).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="sm:w-[35rem] flex items-center justify-start p-2 pl-0 gap-2 text-md font-medium"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                    {value && value.path ? (
                      // Handle the case where the value is an object with a valid path
                      <a
                        href={value.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
                      >
                        View
                      </a>
                    ) : typeof value === "string" ||
                      typeof value === "number" ? (
                      // Render normal value
                      <h3 className="text-sm font-normal">{value}</h3>
                    ) : (
                      // Fallback for null/undefined value or unsupported type
                      <h3 className="text-sm font-normal text-gray-500">
                        Invalid Data
                      </h3>
                    )}
                  </div>
                )
              )}
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
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold text-start mb-4 text-[#BF3606]">
          Edit Receipt
        </h2>
        <div className="w-[20rem] sm:w-[40rem] h-[30rem] overflow-auto flex flex-col gap-3 items-start mb-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 w-[20rem] sm:w-[38rem]"
          >
            {currentReceipt &&
              currentReceipt.fields &&
              Object.entries(currentReceipt.fields).map(
                ([key, value], index) => {
                  // Check if the value is an object
                  if (
                    typeof value === "object" &&
                    value !== null &&
                    value.name &&
                    value.type &&
                    value.path
                  ) {
                    return (
                      <div key={index} className="mb-4">
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)} (File)
                        </label>
                        <input
                          id={key}
                          name={key}
                          type="file"
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    );
                  } else {
                    return (
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
                          value={currentReceipt.fields[key] || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    );
                  }
                }
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
    </section>
  );
};

export default ViewReceipts;
