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

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/staff-dashboard",
    element: <StaffDashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/add-receipt",
    element: <AddReceipt />,
  },
  {
    path: "/change-form",
    element: <ChangeForm />,
  },
  {
    path: "/favourites",
    element: <Favourites />,
  },
  {
    path: "/view-receipts",
    element: <ViewReceipts />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
