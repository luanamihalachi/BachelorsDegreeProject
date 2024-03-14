import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { FormattedMessage } from "react-intl";
import LangSelector from "../intl/LangSelector";
import BASE_API_URL from "../../util/config";

function EmployeeMainNavigation() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = atob(token.split(".")[1]);
  const parsedToken = JSON.parse(decodedToken);
  const desiredField = parsedToken.departmentManager;

  useEffect(() => {
    // Extract the current pathname from the location object
    const currentPath = location.pathname;

    // Set the selectedKeys based on the current pathname
    if (currentPath === "/employee/dashboard") {
      setSelectedKeys(["2"]);
    } else if (currentPath === "/employee/personal-info") {
      setSelectedKeys(["3"]);
    } else if (currentPath === "/employee/personal-requests/create") {
      setSelectedKeys(["4"]);
    } else if (currentPath === "/employee/attendance") {
      setSelectedKeys(["5"]);
    } else if (currentPath === "/employee/personal-requests") {
      setSelectedKeys(["6"]);
    } else if (currentPath === "/employee/approve-leave-requests") {
      setSelectedKeys(["7"]);
    }
    // Add more conditions as needed for other routes
  }, [location.pathname]); // Update when the pathname changes

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/");
        console.log("Logged out");
      } else {
        console.error("Failed to logout on the backend");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Menu
        theme="dark"
        mode="vertical"
        selectedKeys={selectedKeys}
        style={{
          height: "100vh",
          width: "17.5%",
          borderRight: "none",
          position: "fixed",
          borderRadius: "0 5px 5px 0",
          fontSize: "100%",
          overflowY: "auto",
        }}
      >
        <Menu.Item key="1">
          <LangSelector />
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/employee/dashboard">
            <FormattedMessage
              id="app.employee.nav.dashboard"
              defaultMessage={"Personal dashboard"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/employee/personal-info">
            <FormattedMessage
              id="app.employee.nav.personal_info"
              defaultMessage={"See personal data"}
            />
          </Link>
        </Menu.Item>
        {/* <Menu.Item key="4">
          <Link to="/employee/personal-requests/create">
            <FormattedMessage
              id="app.employee.nav.requests_create"
              defaultMessage={"Request data change"}
            />
          </Link>
        </Menu.Item> */}
        <Menu.Item key="5">
          <Link to="/employee/attendance">
            <FormattedMessage
              id="app.attendance"
              defaultMessage={"Attendance"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/employee/personal-requests">
            <FormattedMessage
              id="app.employee.nav.see_all_requests"
              defaultMessage={"All requests"}
            />
          </Link>
        </Menu.Item>

        {desiredField && (
          <Menu.Item key="7">
            <Link to="/employee/approve-leave-requests">
              <FormattedMessage
                id="app.nav.approve-leave-requests"
                defaultMessage={"Approve leave requests"}
              />
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="logout">
          <div onClick={handleLogout} style={{ cursor: "pointer" }}>
            <FormattedMessage id="app.logout" defaultMessage={"Logout"} />
          </div>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default EmployeeMainNavigation;

// return (
//   <nav>
//     <ul>
//       <li>
//         <NavLink to="/employee/dashboard">
//           <FormattedMessage
//             id="app.employee.nav.dashboard"
//             defaultMessage={"Dashboard"}
//           />
//         </NavLink>
//       </li>
//       <li>
//         <NavLink to="/hr/dashboard">
//           <FormattedMessage
//             id="app.hr.nav.dashboard"
//             defaultMessage={"HR dashboard"}
//           />
//         </NavLink>
//       </li>
//       <li>
//         <NavLink to="/employee/requests/create">
//           <FormattedMessage
//             id="app.employee.nav.create_new_request_personal_data"
//             defaultMessage={
//               "Create new request for personal data modifications"
//             }
//           />
//         </NavLink>
//       </li>
//       <li>
//         <NavLink to="/employee/requests">
//           <FormattedMessage
//             id="app.employee.nav.see_requests_made"
//             defaultMessage={"See all requests made"}
//           />
//         </NavLink>
//       </li>
//       <li>
//         <NavLink to="/employee/leave/create">
//           <FormattedMessage
//             id="app.employee.nav.create_new_leave_request"
//             defaultMessage={"Create new leave request"}
//           />
//         </NavLink>
//       </li>
//     </ul>
//   </nav>
// );
