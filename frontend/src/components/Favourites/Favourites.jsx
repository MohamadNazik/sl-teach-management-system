import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Header from "../Header";
import DataTable from "react-data-table-component";
// import receipts from "../../assets/sample_data/Receipts";
import { AuthContext } from "../../utils/context/AuthContext";
import redFillHeart from "../../assets/icons/redfillheart.svg";
import { toastAlert } from "../../utils/Alerts/toastAlert";
import { sweetAlert } from "../../utils/Alerts/sweetAlert";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

const Favourites = () => {
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState([]);

  const [viewModalIsOpen, setviewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState({});

  const [isRemoved, setIsRemoved] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [isColorChanged, setIsColorChanged] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteReceipts = async () => {
      if (currentUser) {
        setIsLoading(true);
        await axios
          .get(`${backendUrl}/receipt/get-favourite/${currentUser.id}`)
          .then((response) => {
            // console.log(response.data.data);
            setRecords(response.data.data);
            setIsLoading(false);

            const columns = Object.keys(response.data.data[0].fields || {})
              .filter((key) => key !== "Upload Image" && key !== "color") // Exclude specific keys
              .map((key) => ({
                name:
                  key === "price"
                    ? "Euro(price)"
                    : key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
                selector: (row) => {
                  const value = row.fields[key];

                  return value;
                },
                sortable: true,
                field: key,
              }));

            // Add custom columns for 'Label Color'
            columns.push({
              name: "Label Color",
              cell: (row) => (
                <div
                  className={`block w-full p-3 ${
                    row.fields.color === "red"
                      ? "bg-red-500"
                      : row.fields.color === "blue"
                      ? "bg-blue-500"
                      : row.fields.color === "green"
                      ? "bg-green-500"
                      : row.fields.color === "yellow"
                      ? "bg-yellow-500"
                      : row.fields.color === "orange"
                      ? "bg-orange-500"
                      : row.fields.color === "gray"
                      ? "bg-gray-500"
                      : "bg-transparent"
                  }`}
                >
                  <select
                    id=""
                    onChange={(e) => {
                      handleRowColorChange(e, row);
                    }}
                    className="h-7 border border-gray-300 text-gray-600 text-sm rounded-lg block w-28 py-0.5 px-1 focus:outline-none"
                  >
                    <option
                      value=""
                      selected={row.fields.color === "" ? true : false}
                    >
                      No Color
                    </option>
                    <option
                      value="red"
                      className="text-red-600 font-bold"
                      selected={row.fields.color === "red" ? true : false}
                    >
                      Red
                    </option>
                    <option
                      value="blue"
                      className="text-blue-600 font-bold"
                      selected={row.fields.color === "blue" ? true : false}
                    >
                      Blue
                    </option>
                    <option
                      value="green"
                      className="text-green-600 font-bold"
                      selected={row.fields.color === "green" ? true : false}
                    >
                      Green
                    </option>
                    <option
                      value="yellow"
                      className="text-yellow-600 font-bold"
                      selected={row.fields.color === "yellow" ? true : false}
                    >
                      Yellow
                    </option>
                    <option
                      value="orange"
                      className="text-orange-600 font-bold"
                      selected={row.fields.color === "orange" ? true : false}
                    >
                      Orange
                    </option>
                    <option
                      value="gray"
                      className="text-gray-600 font-bold"
                      selected={row.fields.color === "gray" ? true : false}
                    >
                      Gray
                    </option>
                  </select>
                </div>
              ),

              width: "11rem",
            });

            // Add custom columns for 'Actions'
            columns.push({
              name: "Actions",
              cell: (row) => (
                <>
                  <div>
                    <img
                      src={redFillHeart}
                      alt=""
                      className="w-5 cursor-pointer"
                      onClick={() => removeFavourites(row._id, currentUser)}
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
            // console.error("Error fetching favorite receipts:", error);
            if (error.response && error.response.status === 404) {
              toastAlert("error", error.response.data.message);
              setRecords([]);
              setIsLoading(false);
            } else {
              toastAlert("error", error.response.data.message);
              setIsLoading(false);
            }
          });
      }
    };
    // setIsRemoved(false);
    // console.log(isRemoved);

    fetchFavoriteReceipts();
  }, [
    currentUser,
    isRemoved,
    editModalIsOpen,
    deleteButtonClicked,
    isColorChanged,
  ]);

  const handleRowColorChange = async (e, row) => {
    // console.log(row);
    const id = row._id;
    const color = e.target.value;

    setIsLoading(true);

    await axios
      .put(`${backendUrl}/filter/update-color/${id}`, {
        color: color,
      })
      .then((response) => {
        // console.log(response.data);
        setIsColorChanged((prev) => !prev);
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error);
        setIsLoading(false);
      });
  };

  const removeFavourites = async (receiptId, currentUser) => {
    const userId = currentUser.id;

    // Remove from favorites

    setIsLoading(true);
    await axios
      .post(`${backendUrl}/receipt/remove-favourite`, {
        userId: userId,
        recieptId: receiptId,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          setIsRemoved((prev) => !prev);
          toastAlert("success", "Removed from favorites");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
        if (error.response && error.response.status === 404) {
          // Handle error response from the server
          toastAlert("error", error.response.data.message);
          setIsLoading(false);
        } else {
          // Handle server or network error
          toastAlert("error", error.response.data.message);
          setIsLoading(false);
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = currentReceipt._id;
    // console.log(id);
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/receipt/update-receipt/${id}`,
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
        setIsLoading(false);
      }
    } catch (error) {
      // console.error("Error submitting form", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Removed 'type' since it's not used

    setCurrentReceipt((prevReceipt) => ({
      ...prevReceipt,
      fields: {
        ...prevReceipt.fields,
        [name]: value, // Update the specific field
      },
    }));
  };

  const handleDeleteButton = async (receipt) => {
    const id = receipt._id;
    // console.log(receipt);
    sweetAlert("Are you sure you want to delete the receipt?").then(
      (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          axios
            .delete(`${backendUrl}/receipt/delete-receipt/${id}`)
            .then((response) => {
              // console.log("Response:", response.data);
              if (response.data.success) {
                setDeleteButtonClicked(true);
                toastAlert("success", "Receipt Deleted !");
                // console.log(response.data.message);
                setIsLoading(false);
              }
            })
            .catch((error) => {
              // console.error("Error submitting form", error);
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
    if (typeof value !== "string") return false;
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
      <Header page="Favorites" isDashboard={false} />

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
      <div className="w-[100] m-5 mt-12 sm:mt-4 bg-white p-2 rounded-xl">
        {isLoading ? (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <DataTable
            columns={columns}
            data={records}
            customStyles={customStyles}
            pagination
            paginationRowsPerPageOptions={[50, 100, 200, 500, 1000, 1500]} // Custom dropdown valuess
            paginationPerPage={50}
          />
        )}
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
                ([key, value], index) => {
                  if (key === "color") return null;

                  return (
                    <div
                      key={index}
                      className="sm:w-[35rem] flex items-center justify-start p-2 pl-0 gap-2 text-md font-medium"
                    >
                      {key === "price"
                        ? "Euro(price)"
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                      :{" "}
                      {typeof value === "string" ? (
                        isFile(value) || value.startsWith("http") ? ( // Check if value is a file or a path
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium bg-blue-700 px-3 py-2 text-white rounded-md hover:bg-blue-900"
                          >
                            View
                          </a>
                        ) : (
                          <h3 className="text-sm font-normal">{value}</h3> // Render normal value
                        )
                      ) : (
                        <h3 className="text-sm font-normal">{value}</h3> // Render normal value
                      )}
                    </div>
                  );
                }
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
                  const isPath =
                    typeof value === "string" &&
                    (value.startsWith("http://") ||
                      value.startsWith("https://"));
                  const isFilePath = isFile(value); // Check if it's a file path

                  return (
                    <div key={index} className="mb-4">
                      {!(isPath || isFilePath) && key !== "color" ? ( // Render input only if it's not a path or file
                        <>
                          <label
                            htmlFor={key}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {key === "price"
                              ? "Euro(price)"
                              : key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                          <input
                            id={key}
                            name={key}
                            type="text"
                            value={value || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </>
                      ) : null}
                    </div>
                  );
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

export default Favourites;
