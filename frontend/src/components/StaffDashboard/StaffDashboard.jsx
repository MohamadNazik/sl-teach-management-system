import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import DetailCard from "../DetailCard";

import viewReceiptsIcon from "../../assets/icons/view_receipts_blue.svg";
import addReceiptIcon from "../../assets/icons/add_receipt_blue.svg";

const StaffDashboard = () => {
  return (
    <section className="h-screen">
      <Header page="Staff Dashboard" isDashboard={true} />
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
