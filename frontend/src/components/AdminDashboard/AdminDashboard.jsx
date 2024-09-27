import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import DetailCard from "../DetailCard";

import viewReceiptsIcon from "../../assets/icons/view_receipts_blue.svg";
import addReceiptIcon from "../../assets/icons/add_receipt_blue.svg";
import changeFormIcon from "../../assets/icons/change_form_blue.svg";
import profileIconBlue from "../../assets/icons/profile_blue.svg";

const AdminDashboard = () => {
  return (
    <section className="h-[50rem] md:h-[42rem] relative">
      <Header page="Admin Dashboard" isDashboard={true} />

      <Link to={"/change-password"}>
        <button className="absolute right-16 bottom-16 md:bottom-8  text-md rounded-md w-56 pl-6 pr-6 pt-2 pb-2 bg-[#BF3606] my-8 font-semibold text-white">
          CHANGE PASSWORD
        </button>
      </Link>

      <div className="w-[100%] h-[30rem] flex items-center justify-center mt-20">
        <div className="w-[22rem] mt-10 sm:mt-20 md:mt-36 lg:m-0 grid grid-cols-2 auto-rows-[14rem] md:grid-cols-3 md:w-[60rem] md:auto-rows-[19rem] lg:auto-rows-[19rem] lg:grid-cols-4 lg:w-[65rem] ">
          <Link to={"/view-receipts"}>
            <DetailCard icon={viewReceiptsIcon} title="View Receipts" />
          </Link>
          <Link to={"/add-receipt"}>
            <DetailCard icon={addReceiptIcon} title="Add Receipt" />
          </Link>
          <Link to={"/change-form"}>
            <DetailCard icon={changeFormIcon} title="Change form" />
          </Link>
          <Link to={"/manage-staff"}>
            <DetailCard icon={profileIconBlue} title="Manage Staff" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
