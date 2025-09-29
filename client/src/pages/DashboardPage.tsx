import React from "react";
import { useAuth } from "../context/AuthContext";

// अलग-अलग dashboards import करो
import AdminDashboard from "./Admin/AdminDashboard";
import StaffDashboard from "./Admin/StaffDashboard";
import PharmacistDashboard from "./Admin/PharmacistDashboard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center text-gray-500">Please login to continue.</p>;
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "staff":
      return <StaffDashboard />;
    case "pharmacist":
      return <PharmacistDashboard />;
    default:
      return <p className="text-center text-gray-500">No dashboard available for this role.</p>;
  }
};

export default DashboardPage;
