import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { extractedUserRole } from "../../../util/auth";
import EmployeeMainNavigation from "../../../components/employee/EmployeeMainNavigation";

export default function EmployeeAuthorization() {
  const userRole = extractedUserRole();
  if (userRole !== "employee") return <Navigate to="/unauthorized" />;
  return (
    <div style={{ display: "flex" }}>
      <EmployeeMainNavigation />
      <Outlet />
    </div>
  );
}
