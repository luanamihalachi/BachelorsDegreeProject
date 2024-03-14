import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function HrRequestsPending() {
  const [sortedEmployees, setSortedEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/api/hr/requests/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.map((pendingRequests) => ({
          ...pendingRequests,
          key: pendingRequests.requestId,
        }));
        setPendingRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pending requests:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    setSortedEmployees(sorter);
  };

  const columns = [
    {
      title: (
        <FormattedMessage
          id="app.requestName"
          defaultMessage={"Request name"}
        />
      ),
      dataIndex: "requestName",
      key: "requestName",
      sorter: (a, b) => a.requestName.localeCompare(b.requestName),
      sortOrder:
        sortedEmployees.columnKey === "requestName" && sortedEmployees.order,
      showSorterTooltip: false,
    },
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
      render: (text, record) => {
        const lastName = record.Employee.lastName;
        return <span>{`${lastName}`}</span>;
      },
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
      render: (text, record) => {
        const firstName = record.Employee.firstName;
        return <span>{`${firstName}`}</span>;
      },
    },
    {
      title: (
        <FormattedMessage id="app.details" defaultMessage={"See details"} />
      ),
      key: "actions",
      render: (text, record) => (
        <Link to={`/hr/employees/requests/${record.requestId}`}>
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
      ) : pendingRequests.length > 0 ? (
        <Table
          dataSource={pendingRequests}
          columns={columns}
          onChange={handleChange}
        />
      ) : (
        <p>
          <FormattedMessage
            id="app.hr.pending_requests.no_requests"
            defaultMessage={"No pending requests."}
          />
        </p>
      )}
    </div>
  );
}

export default HrRequestsPending;
