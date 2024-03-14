import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function HrEmployeesList() {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortedEmployees, setSortedEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/api/hr/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.map((employee) => ({
          ...employee,
          key: employee.employeeId,
        }));
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    setSortedEmployees(sorter);
    setFilteredEmployees(filters);
  };

  const columns = [
    {
      title: (
        <FormattedMessage id="app.last_name" defaultMessage={"Last name"} />
      ),
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortOrder:
        sortedEmployees.columnKey === "lastName" && sortedEmployees.order,
      showSorterTooltip: false,
    },
    {
      title: (
        <FormattedMessage id="app.first_name" defaultMessage={"First name"} />
      ),
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      sortOrder:
        sortedEmployees.columnKey === "firstName" && sortedEmployees.order,
      showSorterTooltip: false,
    },
    {
      title: (
        <FormattedMessage id="app.department" defaultMessage={"Department"} />
      ),
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "HR", value: "HR" },
        { text: "IT", value: "IT" },
        { text: "Finance", value: "Finance" },
        { text: "Marketing", value: "Marketing" },
        { text: "Legal", value: "Legal" },
        { text: "Management", value: "Management" },
        { text: "PR", value: "PR" },
      ],
      filteredValue: filteredEmployees.department || null,
      onFilter: (value, record) => record.department === value,
    },
    {
      title: (
        <FormattedMessage id="app.job_title" defaultMessage={"Job title"} />
      ),
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: (
        <FormattedMessage id="app.details" defaultMessage={"See details"} />
      ),
      key: "actions",
      render: (text, record) => (
        <Link to={`/hr/employees/${record.User.username}`}>
          <Space size="middle">
            <ArrowRightOutlined />
          </Space>
        </Link>
      ),
    },
  ];
  return (
    <div
      style={{
        marginLeft: "20%",
        padding: "20px",
        flexGrow: 1,
        marginTop: "20px",
      }}
    >
      {loading ? (
        <p>
          <FormattedMessage id="app.loading" defaultMessage={"Loading..."} />
        </p>
      ) : employees.length > 0 ? (
        <Table
          dataSource={employees}
          columns={columns}
          onChange={handleChange}
        />
      ) : (
        <p>
          <FormattedMessage
            id="app.hr.see_all_employees.no_employees"
            defaultMessage={"No employees in the database."}
          />
        </p>
      )}
    </div>
  );
}

export default HrEmployeesList;
