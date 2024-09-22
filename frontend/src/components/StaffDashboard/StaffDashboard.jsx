import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import DetailCard from "../DetailCard";

import viewReceiptsIcon from "../../assets/icons/view_receipts_blue.svg";
import addReceiptIcon from "../../assets/icons/add_receipt_blue.svg";

const StaffDashboard = () => {
  return (
    <section className="h-[40rem] md:h-[42rem] relative">
      <Header page="Staff Dashboard" isDashboard={true} />

      <Link to={"/change-password"}>
        <button className="absolute right-16 bottom-16 md:bottom-8  text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white">
          CHANGE PASSWORD
        </button>
      </Link>

      <div className="flex gap-4 items-center justify-center h-[30rem]">
        <Link to={"/view-receipts"}>
          <DetailCard icon={viewReceiptsIcon} title="View Receipts" />
        </Link>
        <Link to={"/add-receipt"}>
          <DetailCard icon={addReceiptIcon} title="Add Receipt" />
        </Link>
      </div>
    </section>
  );
};

export default StaffDashboard;
