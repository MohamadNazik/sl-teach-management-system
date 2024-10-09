import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Header from "../Header";
import DataTable from "react-data-table-component";
// import receipts from "../../assets/sample_data/Receipts";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import lineHeart from "../../assets/icons/lineheart.svg";
import redFillHeart from "../../assets/icons/redfillheart.svg";
import { sweetAlert } from "../../utils/Alerts/sweetAlert";
import { toastAlert } from "../../utils/Alerts/toastAlert";
import { AuthContext } from "../../utils/context/AuthContext";

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
      fontSize: "0.8rem",
      width: "100px",
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
  rows: {
    style: {
      paddingTop: "2px",
    },
  },
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [month, setMonth] = useState();
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [codiciId, setCodiciId] = useState("");
  const [banca, setBanca] = useState("");
  const [benef, setBenef] = useState("");
  const [ordinate, setOrdinate] = useState("");
  const [causale, setCausale] = useState("");
  const [color, setColor] = useState("");
  const [isColorChanged, setIsColorChanged] = useState(false);
  const [inputFields, setInputFields] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${backendUrl}/receipt/get-receipts`)
        .then((response) => {
          // console.log(response);

          setResData(response.data.result);
          setIsLoading(false);

          // Generate columns based on data
          const columns = Object.keys(response.data.result[0].fields || {})
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
            setIsLoading(false);
          } else {
            // Handle server or network error
            toastAlert("error", error.response.data.message);
            setIsLoading(false);
          }
        });
    };

    setDeleteButtonClicked(false);

    fetchData();
  }, [
    editModalIsOpen,
    deleteButtonClicked,
    currentUser,
    favoriteReceipts,
    isColorChanged,
  ]);

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
  }, []);

  const handleRowColorChange = async (e, row) => {
    // console.log(row);
    setIsLoading(true);
    const id = row._id;
    const color = e.target.value;

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

  useEffect(() => {
    const fetchFavoriteReceipts = async () => {
      if (currentUser) {
        setIsLoading(true);
        await axios
          .get(`${backendUrl}/receipt/get-favourite/${currentUser.id}`)
          .then((favoritesResponse) => {
            setFavoriteReceipts(
              favoritesResponse.data.data.map((fav) => fav._id)
            );
            setIsLoading(false);
          })
          .catch((error) => {
            // console.error("Error fetching favorite receipts:", error);
            if (error.response && error.response.status === 404) {
              setFavoriteReceipts([]);
              setIsLoading(false);
            } else {
              toastAlert("error", error.response.data.message);
              setIsLoading(false);
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
        setIsLoading(true);
        await axios
          .post(`${backendUrl}/receipt/remove-favourite`, {
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
      } else {
        // Add to favorites
        setIsLoading(true);
        await axios
          .post(`${backendUrl}/receipt/add-favourite`, {
            userId: userId,
            recieptId: receiptId,
          })
          .then((response) => {
            // console.log(response);
            if (response.data.success) {
              setFavoriteReceipts([...favoriteReceipts, receiptId]);
              toastAlert("success", "Added to favorites");
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
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toastAlert("error", error.response.data.message);
        setIsLoading(false);
      } else {
        toastAlert("error", error.response.data.message);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {}, [resData]);

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
      setIsLoading(false);
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
                setIsLoading(false);
                // console.log(response.data.message);
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

  const filterDataFetch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios
      .post(`${backendUrl}/filter/get-filter`, {
        month: month,
        minPrice: minPrice,
        maxPrice: maxPrice,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        codiciId: codiciId,
        banca: banca,
        benef: benef,
        ordinate: ordinate,
        causale: causale,
        color: color,
      })
      .then((responce) => {
        // console.log(responce);
        setResData(responce.data.receipts);
        setIsLoading(false);
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

  return (
    <section>
      <Header page="View Receipts" isDashboard={false} />

      {/* Filters section */}

      <div className="w-[100] mt-12 sm:mt-2 mx-5 bg-white py-7 px-5 rounded-xl gap-5 items-center">
        <form
          onSubmit={filterDataFetch}
          className="flex flex-col gap-4 items-center"
        >
          <div className="flex flex-wrap gap-3 justify-center md:justify-start overflow-x-auto">
            {/* Month filter */}
            <div className="bg-[#F05924] w-[7rem] px-2 pt-0.25 pb-0.5 text-white flex justify-between items-center rounded-lg">
              <select
                name="month"
                onChange={(e) => setMonth(e.target.value)}
                className="h-9 block w-full text-sm font-semibold text-white bg-transparent rounded-md placeholder-black/50 focus:outline-none leading-relaxed"
              >
                <option value="" className="text-black" disabled selected>
                  Month
                </option>
                <option value="1" className="text-black">
                  January
                </option>
                <option value="2" className="text-black">
                  February
                </option>
                <option value="3" className="text-black">
                  March
                </option>
                <option value="4" className="text-black">
                  April
                </option>
                <option value="5" className="text-black">
                  May
                </option>
                <option value="6" className="text-black">
                  June
                </option>
                <option value="7" className="text-black">
                  July
                </option>
                <option value="8" className="text-black">
                  August
                </option>
                <option value="9" className="text-black">
                  September
                </option>
                <option value="10" className="text-black">
                  October
                </option>
                <option value="11" className="text-black">
                  November
                </option>
                <option value="12" className="text-black">
                  December
                </option>
              </select>
            </div>

            {/* Color filter */}
            <div className="bg-[#F05924] w-[9rem] px-2 pt-0.25 pb-0.5 text-white flex justify-between items-center rounded-lg">
              <select
                name="color"
                onChange={(e) => setColor(e.target.value)}
                className="h-9 block w-full text-sm font-semibold text-white bg-transparent rounded-md placeholder-black/50 focus:outline-none leading-relaxed"
              >
                <option value="" className="text-black" disabled selected>
                  Label Color
                </option>
                <option value="red" className="text-red-600 font-bold">
                  Red
                </option>
                <option value="blue" className="text-blue-600 font-bold">
                  Blue
                </option>
                <option value="green" className="text-green-600 font-bold">
                  Green
                </option>
                <option value="yellow" className="text-yellow-600 font-bold">
                  Yellow
                </option>
                <option value="orange" className="text-orange-600 font-bold">
                  Orange
                </option>
                <option value="gray" className="text-gray-600 font-bold">
                  Gray
                </option>
              </select>
            </div>

            {/* Codici Id filter */}
            <div className="bg-[#F05924] w-[12.5rem] md:w-[16rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Codici ID</p>
              <input
                type="text"
                placeholder="Codici ID"
                className="block bg-white w-[7rem] md:w-[10rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border border-white rounded-md focus:outline-none"
                value={codiciId}
                onChange={(e) => setCodiciId(e.target.value)}
              />
            </div>

            {/* Benef filter */}
            <div className="bg-[#F05924] w-[11.5rem] md:w-[13rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Benef</p>
              <input
                type="text"
                value={benef}
                placeholder="Benef"
                className="block bg-white w-[7rem] md:w-[8.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border border-white rounded-md focus:outline-none"
                onChange={(e) => setBenef(e.target.value)}
              />
            </div>

            {/* Banca filter */}
            <div className="bg-[#F05924] w-[11.5rem] md:w-[13rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Banca</p>
              <input
                type="text"
                placeholder="Banca"
                value={banca}
                className="block bg-white w-[7rem] md:w-[8.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border border-white rounded-md focus:outline-none"
                onChange={(e) => setBanca(e.target.value)}
              />
            </div>

            {/* Ordinate filter */}
            <div className="bg-[#F05924] w-[13.5rem] md:w-[14rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Ordinate</p>
              <input
                type="text"
                placeholder="Ordinate"
                value={ordinate}
                className="block bg-white w-[8rem] md:w-[8.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border border-white rounded-md focus:outline-none"
                onChange={(e) => setOrdinate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {/* Causale filter */}
            <div className="bg-[#F05924] w-[13rem] md:w-[14rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Causale</p>
              <input
                type="text"
                placeholder="Causale"
                value={causale}
                className="block bg-white w-[7.5rem] md:w-[8.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border border-white rounded-md focus:outline-none"
                onChange={(e) => setCausale(e.target.value)}
              />
            </div>

            {/* Price filter */}
            <div className="bg-[#F05924] w-[20rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Price Range</p>
              <input
                type="text"
                placeholder="Start"
                className="block bg-white w-[6.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border-none rounded-md focus:outline-none focus:border-none"
                onChange={(e) => setMinPrice(parseFloat(e.target.value))}
              />
              <input
                type="text"
                placeholder="End"
                className="block bg-white w-[6.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border-none rounded-md focus:outline-none focus:border-none"
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              />
            </div>

            {/* Date Range */}
            <div className="bg-[#F05924] w-[20rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Date Range</p>
              <input
                type="text"
                placeholder="Start Date"
                className="block bg-white w-[6.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border-none rounded-md focus:outline-none focus:border-none"
                value={startDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => !startDate && (e.target.type = "text")}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="End Date"
                className="block bg-white w-[6.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border-none rounded-md focus:outline-none focus:border-none"
                value={endDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => !endDate && (e.target.type = "text")}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Time Range */}
            <div className="bg-[#F05924] w-[20rem] py-2 px-3 text-white flex justify-between items-center rounded-lg">
              <p className="text-sm font-semibold">Time Range</p>
              <input
                type="text"
                placeholder="Start Time"
                className="block bg-white w-[6.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border-none rounded-md focus:outline-none focus:border-none"
                value={startTime}
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => !startTime && (e.target.type = "text")}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <input
                type="text"
                placeholder="End Time"
                className="block bg-white w-[6.5rem] pr-3 pl-2 py-1 text-xs font-normal shadow-xs text-black bg-transparent border-none rounded-md focus:outline-none focus:border-none"
                value={endTime}
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => !endTime && (e.target.type = "text")}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-10">
            <button
              type="submit"
              className="text-md rounded-md w-32 sm:w-28 pl-6 pr-6 pt-1 pb-1.5 bg-[#BF3606] font-semibold text-white"
            >
              Search
            </button>
            <button
              className="text-md rounded-md w-32 sm:w-28 pl-6 pr-6 pt-1 pb-1.5 bg-white font-semibold text-[#BF3606] border-2 border-[#BF3606]"
              onClick={() => window.location.reload()}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="w-[100] m-5 bg-white p-2 rounded-xl">
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
            data={resData}
            customStyles={customStyles}
            pagination
            paginationRowsPerPageOptions={[50, 100, 200, 500, 1000, 1500]} // Custom dropdown valuess
            paginationPerPage={50}
          />
          // {/* {console.log("Columns : ", columns)} */}
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
            {inputFields && currentReceipt && (
              <>
                {inputFields.map((field, index) => {
                  const fieldName = field.fieldName; // Use fieldName for labeling
                  const fieldValue =
                    currentReceipt.fields &&
                    currentReceipt.fields[fieldName] !== undefined
                      ? currentReceipt.fields[fieldName]
                      : ""; // Check if currentReceipt.fields exists

                  const isPath =
                    typeof fieldValue === "string" &&
                    (fieldValue.startsWith("http://") ||
                      fieldValue.startsWith("https://"));
                  const isFilePath = isFile(fieldValue);
                  const isColor = field.fieldType === "color"; // Check fieldType for color input

                  return (
                    <div key={index} className="mb-4">
                      {!isPath && !isFilePath && !isColor ? (
                        <>
                          <label
                            htmlFor={fieldName}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {fieldName === "price"
                              ? "Euro (price)"
                              : fieldName.charAt(0).toUpperCase() +
                                fieldName.slice(1)}
                          </label>
                          <input
                            id={fieldName}
                            name={fieldName}
                            type={field.fieldType || "text"} // Use the fieldType from the data
                            value={fieldValue}
                            onChange={(e) => handleChange(e, fieldName)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </>
                      ) : isColor ? (
                        <>
                          <label
                            htmlFor={fieldName}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {fieldName.charAt(0).toUpperCase() +
                              fieldName.slice(1)}
                          </label>
                          <input
                            id={fieldName}
                            name={fieldName}
                            type="color"
                            value={fieldValue || "#ffffff"} // Default to white if no value
                            onChange={(e) => handleChange(e, fieldName)}
                            className="mt-1 block w-full h-10"
                          />
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-20 text-md font-medium bg-green-700 px-3 py-2 text-white rounded-md hover:bg-green-900"
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
