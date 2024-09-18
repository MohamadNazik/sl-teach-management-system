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

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
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
    path: "*",
    element: <div>Page not found!</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
