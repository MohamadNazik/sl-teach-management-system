import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const StaffProtectiveRoutes = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // console.log(currentUser);

  if (currentUser === null || currentUser.role !== 0) {
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};

export default StaffProtectiveRoutes;
