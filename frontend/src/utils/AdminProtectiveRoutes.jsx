import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate, replace } from "react-router-dom";

const AdminProtectiveRoutes = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // console.log(currentUser);

  if (currentUser === null || currentUser.role !== 1) {
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};

export default AdminProtectiveRoutes;
