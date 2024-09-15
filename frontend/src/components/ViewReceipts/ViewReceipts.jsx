import React, { useState } from "react";
import Header from "../Header";
import DataTable from "react-data-table-component";
import receipts from "../../assets/sample_data/Receipts";

const columns = [
  ...Object.keys(receipts[0]).map((key) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
      selector: (row) => row[key], // Access the dynamic key
      sortable: true,
      field: key, // Add field key for reference
    };
  }),
  {
    name: "Actions",
    cell: (row) => (
      <>
        <button className="text-md font-medium bg-blue-700 px-3 py-2 text-white rounded-md">
          View
        </button>
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
    width: "200px",
  },
];

const customStyles = {
  headCells: {
    style: {
      color: "black",
      fontWeight: "700",
      fontSize: "0.85rem",
    },
  },
  cells: {
    style: {
      fontSize: "0.75rem",
    },
  },
};

const ViewReceipts = () => {
  const [records, setRecords] = useState(receipts);

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
          data={records}
          customStyles={customStyles}
          pagination
          paginationRowsPerPageOptions={[50, 100, 200, 500, 1000, 1500]} // Custom dropdown valuess
          paginationPerPage={50}
        />
      </div>
    </section>
  );
};

export default ViewReceipts;
