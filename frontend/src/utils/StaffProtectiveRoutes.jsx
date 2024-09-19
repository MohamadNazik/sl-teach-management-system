import React, { useContext } from "react";

import { Navigate } from "react-router-dom";

const StaffProtectiveRoutes = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // console.log(currentUser.role);

  if (currentUser === null || currentUser.role !== 0) {
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};

export default StaffProtectiveRoutes;
