import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { FormattedMessage } from "react-intl";
import LangSelector from "../intl/LangSelector";
import BASE_API_URL from "../../util/config";

function HrMainNavigation() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = atob(token.split(".")[1]);
  const parsedToken = JSON.parse(decodedToken);
  const desiredField = parsedToken.departmentManager;

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/hr/dashboard") {
      setSelectedKeys(["2"]);
    } else if (currentPath === "/hr/employees") {
      setSelectedKeys(["3"]);
    } else if (currentPath === "/hr/employees/create") {
      setSelectedKeys(["4"]);
    } else if (currentPath === "/hr/employees/requests") {
      setSelectedKeys(["5"]);
    } else if (currentPath === "/hr/employees/requests/pending") {
      setSelectedKeys(["6"]);
    } else if (currentPath === "/hr/personal-info") {
      setSelectedKeys(["7"]);
    } else if (currentPath === "/hr/personal-requests/create") {
      setSelectedKeys(["8"]);
    } else if (currentPath === "/hr/personal-attendance") {
      setSelectedKeys(["9"]);
    } else if (currentPath === "/hr/personal-requests") {
      setSelectedKeys(["10"]);
    } else if (currentPath === "/hr/approve-leave-requests") {
      setSelectedKeys(["11"]);
    }
  }, [location.pathname]);

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
          <Link to="/hr/dashboard">
            <FormattedMessage
              id="app.hr.nav.dashboard"
              defaultMessage={"HR Dashboard"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/hr/employees">
            <FormattedMessage
              id="app.hr.nav.see_all_employees"
              defaultMessage={"See all employees"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/hr/employees/create">
            <FormattedMessage
              id="app.hr.nav.add_employee"
              defaultMessage={"Enter new employee"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/hr/employees/requests">
            <FormattedMessage
              id="app.hr.nav.employee_requests"
              defaultMessage={"See employee requests"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/hr/employees/requests/pending">
            <FormattedMessage
              id="app.hr.nav.pending_employee_requests"
              defaultMessage={"Pending employee requests"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to="/hr/personal-info">
            <FormattedMessage
              id="app.hr.nav.personal_info"
              defaultMessage={"See personal data"}
            />
          </Link>
        </Menu.Item>

        <Menu.Item key="9">
          <Link to="/hr/personal-attendance">
            <FormattedMessage
              id="app.attendance"
              defaultMessage={"Attendance"}
            />
          </Link>
        </Menu.Item>
        <Menu.Item key="10">
          <Link to="/hr/personal-requests">
            <FormattedMessage
              id="app.hr.nav.see_all_requests"
              defaultMessage={"All requests"}
            />
          </Link>
        </Menu.Item>
        {desiredField && (
          <Menu.Item key="11">
            <Link to="/hr/approve-leave-requests">
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

        {/* <Menu.Item key="8">
          <Link to="/hr/certificates/create">
            <FormattedMessage
              id="app.hr.nav.issue_employee_certificate"
              defaultMessage={"Issue employee certificate"}
            />
          </Link>
        </Menu.Item> */}
      </Menu>
    </div>
  );
}

export default HrMainNavigation;
