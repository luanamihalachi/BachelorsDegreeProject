import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { extractedUserRole } from "../../../util/auth";
import HrMainNavigation from "../../../components/hr/HrMainNavigation";

export default function HrAuthorization() {
  const userRole = extractedUserRole();

  if (userRole !== "hr") return <Navigate to="/unauthorized" />;
  return (
    <div style={{ display: "flex" }}>
      <HrMainNavigation />
      <Outlet />
    </div>
  );
}
