import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import DetailCard from "../DetailCard";

import viewReceiptsIcon from "../../assets/icons/view_receipts_blue.svg";
import addReceiptIcon from "../../assets/icons/add_receipt_blue.svg";
import changeFormIcon from "../../assets/icons/change_form_blue.svg";

const AdminDashboard = () => {
  return (
    <section className="h-screen bg-[url('/src/assets/background/body.png')] bg-cover bg-repeat-y ">
      <Header />
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center h-[44rem] sm:h-[30rem] md:h-[30rem]">
        <Link to={"/view-receipts"}>
          <DetailCard icon={viewReceiptsIcon} title="View Receipts" />
        </Link>
        <Link to={"/add-receipt"}>
          <DetailCard icon={addReceiptIcon} title="Add Receipt" />
        </Link>
        <Link to={"/change-form"}>
          <DetailCard icon={changeFormIcon} title="Change form" />
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
