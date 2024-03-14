import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function EmployeeRequestsList() {
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/api/employee/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.map((requests) => ({
          ...requests,
          key: requests.requestId,
        }));
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (pagination, filters, sorter) => {
    setSortedRequests(sorter);
    setFilteredRequests(filters);
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
        sortedRequests.columnKey === "requestName" && sortedRequests.order,
      showSorterTooltip: false,
    },

    {
      title: <FormattedMessage id="app.status" defaultMessage={"Status"} />,
      dataIndex: "requestStatus",
      key: "requestStatus",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Solved", value: "solved" },
        { text: "Denied", value: "denied" },
      ],
      filteredValue: filteredRequests.requestStatus || null,
      onFilter: (value, record) => record.requestStatus === value,
    },
    {
      title: (
        <FormattedMessage id="app.details" defaultMessage={"See details"} />
      ),
      key: "actions",
      render: (text, record) => (
        <Link to={`/employee/personal-requests/${record.requestId}`}>
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
      ) : requests.length > 0 ? (
        <Table
          dataSource={requests}
          columns={columns}
          onChange={handleChange}
        />
      ) : (
        <p>
          <FormattedMessage
            id="app.hr.requests.no_requests"
            defaultMessage={"No requests to show."}
          />
        </p>
      )}
    </div>
  );
}

export default EmployeeRequestsList;
