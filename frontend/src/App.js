import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthPage from "./pages/login/Authentication";
import ErrorPage from "./pages/Error";
import UnauthorizedPage from "./pages/Unauthorized";

import HrDashboard from "./pages/hr/HrDashboard";
import HrAuthorization from "./pages/login/authorization-layout/HrAuthorizationLayout";
import HrEmployeesList from "./pages/hr/HrEmployeesList";
import HrEmployeesCreate from "./pages/hr/HrEmployeesCreate";
import HrRequestsList from "./pages/hr/HrRequestsList";
import HrRequestsPending from "./pages/hr/HrRequestsPending";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeLeaveCreate from "./pages/employee/EmployeeLeaveCreate";
import EmployeeRequestsList from "./pages/employee/EmployeeRequestsList";
import EmployeeAuthorization from "./pages/login/authorization-layout/EmployeeAuthorizationLayout";
import EmployeePersonalInfo from "./pages/employee/EmployeePersonalInfo";
import HrEmployeePage from "./pages/hr/HrEmployeePage";
import HrRequestPage from "./pages/hr/HrRequestPage";
import EmployeeRequestPage from "./pages/employee/EmployeeRequestPage";
import EmployeeLeavesList from "./pages/employee/EmployeeLeavesList";
import EmployeeCalendar from "./pages/employee/EmployeeCalendar";
import HrPersonalRequestsList from "./pages/hr/HrPersonalRequestsList";
import HrEmployeeCalendar from "./pages/hr/HrEmployeeCalendar";

const router = createBrowserRouter([
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  {
    path: "/",
    element: <AuthPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/hr",
    element: <HrAuthorization />,

    children: [
      { path: "/hr/dashboard", element: <HrDashboard /> },
      {
        path: "/hr/employees",
        element: <HrEmployeesList />,
      },
      { path: `/hr/employees/:username`, element: <HrEmployeePage /> },
      {
        path: `/hr/employees/calendar/:username`,
        element: <HrEmployeeCalendar />,
      },
      { path: "/hr/employees/create", element: <HrEmployeesCreate /> },
      { path: "/hr/employees/requests", element: <HrRequestsList /> },
      {
        path: "/hr/employees/requests/pending",
        element: <HrRequestsPending />,
      },
      {
        path: `/hr/employees/requests/:requestId`,
        element: <HrRequestPage />,
      },
      { path: "/hr/personal-info", element: <EmployeePersonalInfo /> },
      {
        path: "/hr/personal-attendance",
        element: <EmployeeCalendar />,
      },
      { path: "/hr/personal-requests", element: <HrPersonalRequestsList /> },
      {
        path: `/hr/personal-requests/:requestId`,
        element: <EmployeeRequestPage />,
      },
      // { path: "/hr/personal-leave/create", element: <EmployeeLeaveCreate /> },
      {
        path: "/hr/approve-leave-requests",
        element: <EmployeeLeavesList />,
      },
    ],
  },

  {
    path: "/employee",
    element: <EmployeeAuthorization />,
    children: [
      { path: "/employee/dashboard", element: <EmployeeDashboard /> },
      { path: "/employee/personal-info", element: <EmployeePersonalInfo /> },
      {
        path: "/employee/attendance",
        element: <EmployeeCalendar />,
      },
      {
        path: "/employee/personal-requests",
        element: <EmployeeRequestsList />,
      },
      {
        path: `/employee/personal-requests/:requestId`,
        element: <EmployeeRequestPage />,
      },
      // {
      //   path: "/employee/personal-leave/create",
      //   element: <EmployeeLeaveCreate />,
      // },
      {
        path: "/employee/approve-leave-requests",
        element: <EmployeeLeavesList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
