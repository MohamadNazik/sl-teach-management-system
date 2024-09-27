import React, { useContext } from "react";
import { Navigate, replace } from "react-router-dom";

const AdminProtectiveRoutes = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // console.log(currentUser.role);

  if (currentUser === null || currentUser.role !== 1) {
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};

export default AdminProtectiveRoutes;
