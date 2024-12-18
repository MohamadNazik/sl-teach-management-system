import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import StaffDashboard from "./components/StaffDashboard/StaffDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import AddReceipt from "./components/AddReceipt/AddReceipt.jsx";
import ChangeForm from "./components/ChangeForm/ChangeForm.jsx";
import Favourites from "./components/Favourites/Favourites.jsx";
import ViewReceipts from "./components/ViewReceipts/ViewReceipts.jsx";
import ManageStaff from "./components/ManageStaff/ManageStaff.jsx";
import { AuthContextProvider } from "./utils/context/AuthContext.jsx";
import AdminProtectiveRoutes from "./utils/AdminProtectiveRoutes.jsx";
import StaffProtectiveRoutes from "./utils/StaffProtectiveRoutes.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/ForgotPasswordPages/ForgotPassword/ForgotPassword.jsx";
import VerifyOTP from "./components/ForgotPasswordPages/VerifyOTP/VerifyOTP.jsx";
import ChangePassword from "./components/ChangePassword/ChangePassword.jsx";
import ResetPassword from "./components/ForgotPasswordPages/ResetPassword/ResetPassword.jsx";
import { ForgotPasswordContextProvider } from "./utils/context/ForgotPasswordContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/staff-dashboard",
    element: (
      <StaffProtectiveRoutes>
        <StaffDashboard />
      </StaffProtectiveRoutes>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <AdminProtectiveRoutes>
        <AdminDashboard />
      </AdminProtectiveRoutes>
    ),
  },
  {
    path: "/add-receipt",
    element: <AddReceipt />,
  },
  {
    path: "/change-form",
    element: (
      <AdminProtectiveRoutes>
        <ChangeForm />
      </AdminProtectiveRoutes>
    ),
  },
  {
    path: "/favourites",
    element: <Favourites />,
  },
  {
    path: "/view-receipts",
    element: <ViewReceipts />,
  },
  {
    path: "/manage-staff",
    element: (
      <AdminProtectiveRoutes>
        <ManageStaff />
      </AdminProtectiveRoutes>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ForgotPasswordContextProvider>
        <ForgotPassword />
      </ForgotPasswordContextProvider>
    ),
    children: [
      {
        path: "verify-otp", // Resolves to /forgot-password/verify-otp
        element: <VerifyOTP />,
      },
      {
        path: "reset-password", // Resolves to /forgot-password/verify-otp
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Page not found!</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ToastContainer newestOnTop={true} />
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
