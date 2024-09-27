import React, { useEffect, useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Header from "../Header";
import InputBox from "../InputBox";
import DataTable from "react-data-table-component";
import { toastAlert } from "../../utils/Alerts/toastAlert";
import { sweetAlert } from "../../utils/Alerts/sweetAlert";
// import users from "../../assets/sample_data/users";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const customStyles = {
  cells: {
    style: {
      fontSize: "0.85rem",
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
      fontSize: "1rem",
    },
  },
};

const ManageStaff = () => {
  const [resData, setResData] = useState([]);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const [isPassHide, setIsPassHide] = useState(true);
  const [isConfirmHide, setIsConfirmHide] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios
        .get(`${backendUrl}/admin/get-all-staff`)
        .then((response) => {
          // console.log(response);
          if (response.data.success) {
            setResData(response.data.users);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          // console.error("Error fetching data:", error);
          if (error.response) {
            // Handle invalid credentials
            toastAlert("error", error.response.data.message);
          } else {
            // Handle server or network error
            toastAlert("error", "Server Error!");
          }
        });
    };

    //setDeleteButtonClicked(false);

    fetchData();
  }, [deleteButtonClicked, addButtonClicked]);

  const handleDeleteButton = async (user) => {
    const id = user._id;
    sweetAlert(`Are you sure you want to\nDelete the "${user.name}"?`).then(
      (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          axios
            .delete(`${backendUrl}/admin/delete-staff/${id}`)
            .then((response) => {
              // console.log("Response:", response.data);
              if (response.data.success) {
                setDeleteButtonClicked((prev) => !prev);
                toastAlert("success", `"${user.name}" is deleted !`);
                setIsLoading(false);
                // console.log(response.data.message);
              }
            })
            .catch((error) => {
              // Handle error cases
              if (error.response) {
                // Handle error response from the server
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await axios
      .post(`${backendUrl}/admin/create-staff`, {
        name: name,
        email: email,
        staffId: staffId,
        password: password,
        confirmPassword: confirmPassword,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          toastAlert("success", `"${response.data.staff.name}" is added !`);
          setAddButtonClicked((prev) => !prev);
          document.querySelector("form").reset(); // Reset the form fields
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // console.error("Error creating staff", error);
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
      name: "Email",
      selector: (row) => row.email,
      // sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="ml-3 text-md font-medium bg-red-700 px-3 py-2 text-white rounded-md hover:bg-red-900"
            onClick={(e) => {
              handleDeleteButton(row);
            }}
          >
            Delete
          </button>
        </>
      ),
      width: "150px",
    },
  ];
  return (
    <section>
      <Header page="Manage Staff" isDashboard={false} />
      <div className="w-[100] m-5 bg-white p-10 flex flex-col xl:flex-row items-start gap-8 xl:gap-40 rounded-xl">
        <div className="w-[20rem] sm:w-[30rem] lg:w-[45rem] flex flex-col gap-4 rounded-xl">
          {isLoading ? (
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <DataTable
              columns={columns}
              data={resData} // Using the imported dataset
              pagination
              customStyles={customStyles}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25]} // Custom dropdown valuess
              paginationPerPage={10}
            />
          )}
        </div>
        <div className="bg-white w-[25rem] lg:w-[40rem] p-10 flex flex-col items-center rounded-xl drop-shadow-xl">
          <h3 className="text-lg font-medium mb-8">ADD NEW STAFF</h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[1.5rem] items-center"
          >
            <InputBox
              type="text"
              label="Name"
              requiredField={true}
              onChange={(e) => setName(e.target.value)}
            />
            <InputBox
              type="text"
              label="Email"
              requiredField={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              type="text"
              label="Staff ID"
              requiredField={true}
              onChange={(e) => setStaffId(e.target.value)}
            />
            <div className="relative">
              <InputBox
                type={isPassHide ? "password" : "text"}
                label="Password"
                requiredField={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="text-black/75 text-xl absolute right-4 top-11 cursor-pointer"
                onClick={() => {
                  setIsPassHide((prev) => !prev);
                }}
              >
                {isPassHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>

            <div className="relative">
              <InputBox
                type={isConfirmHide ? "password" : "text"}
                label="Confirm Password"
                requiredField={true}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="text-black/75 text-xl absolute right-4 top-11 cursor-pointer"
                onClick={() => {
                  setIsConfirmHide((prev) => !prev);
                }}
              >
                {isConfirmHide ? <FaEyeSlash /> : <MdRemoveRedEye />}
              </div>
            </div>

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

export default ManageStaff;
