import { Button, Card, Col, Row, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function EmployeeLeavesList() {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      await axios
        .get(`${BASE_API_URL}/api/employee/leaves`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.map((leaves) => ({
            ...leaves,
            key: leaves.leaveId,
          }));
          setLeaves(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching leaves:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const acceptRequest = async (leaveId) => {
    try {
      const updatedStatus = {
        status: "solved",
      };
      const response = await axios.patch(
        `${BASE_API_URL}/api/employee/leaves/edit/${leaveId}`,
        updatedStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchData();
      } else {
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating leave data:", error);
    }
  };

  const denyRequest = async (leaveId) => {
    try {
      const updatedStatus = {
        status: "denied",
      };
      const response = await axios.patch(
        `${BASE_API_URL}/api/employee/leaves/edit/${leaveId}`,
        updatedStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchData();
      } else {
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating leave data:", error);
    }
  };

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
      ) : leaves.length > 0 ? (
        <Row gutter={16}>
          {leaves.map((item, index) => (
            <Col key={index} span={12}>
              <Card title={item.leaveName} bordered={true}>
                <p>
                  {
                    <FormattedMessage
                      id="app.last_name"
                      defaultMessage={"Last Name"}
                    />
                  }
                  : {item.Employee.lastName}
                </p>
                <p>
                  {
                    <FormattedMessage
                      id="app.first_name"
                      defaultMessage={"First Name"}
                    />
                  }
                  : {item.Employee.firstName}
                </p>
                <p>
                  {
                    <FormattedMessage
                      id="app.description"
                      defaultMessage={"Description"}
                    />
                  }
                  : {item.description}
                </p>
                <p>
                  {
                    <FormattedMessage
                      id="app.reason"
                      defaultMessage={"Reason"}
                    />
                  }
                  : {item.reason}
                </p>
                <p>
                  {
                    <FormattedMessage
                      id="app.startDate"
                      defaultMessage={"Start Date"}
                    />
                  }
                  :
                  {
                    <FormattedDate
                      value={new Date(item.startDate)}
                      year="numeric"
                      month="long"
                      day="2-digit"
                      weekday="long"
                    />
                  }
                </p>
                <p>
                  {
                    <FormattedMessage
                      id="app.endDate"
                      defaultMessage={"End Date"}
                    />
                  }
                  :
                  {
                    <FormattedDate
                      value={new Date(item.endDate)}
                      year="numeric"
                      month="long"
                      day="2-digit"
                      weekday="long"
                    />
                  }
                </p>
                <>
                  <Button
                    type="primary"
                    style={{ background: "green", margin: "10px" }}
                    onClick={() => acceptRequest(item.leaveId)}
                  >
                    <FormattedMessage
                      id="app.accept"
                      defaultMessage={"Accept"}
                    />
                  </Button>
                  <Button
                    type="primary"
                    style={{ background: "red", margin: "10px" }}
                    onClick={() => denyRequest(item.leaveId)}
                  >
                    <FormattedMessage id="app.deny" defaultMessage={"Deny"} />
                  </Button>
                </>
              </Card>
            </Col>
          ))}
        </Row>
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

export default EmployeeLeavesList;
