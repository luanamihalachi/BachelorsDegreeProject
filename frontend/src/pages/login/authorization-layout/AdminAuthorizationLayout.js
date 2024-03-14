import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { extractedUserRole } from "../../../util/auth";

export default function AdminAuthorization() {
  const userRole = extractedUserRole();
  if (userRole !== "admin") return <Navigate to="/unauthorized" />;
  return <Outlet />;
}
