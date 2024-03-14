import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Descriptions, Modal } from "antd";
import { FormattedDate, FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function HrRequestPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [editedRequestStatus, setEditedRequestStatus] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seePicture, setSeePicture] = useState(false);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/hr/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const acceptRequest = async () => {
    try {
      const updatedStatus = {
        requestStatus: "solved",
      };

      const response = await axios.patch(
        `${BASE_API_URL}/api/hr/requests/edit/${request.requestId}`,
        updatedStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate(`/hr/employees/${request.Employee.User.username}`);
      } else {
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating request data:", error);
    }
  };

  const denyRequest = async () => {
    try {
      const updatedStatus = {
        requestStatus: "denied",
      };

      const response = await axios.patch(
        `${BASE_API_URL}/api/hr/requests/edit/${request.requestId}`,
        updatedStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditedRequestStatus(updatedStatus);
        fetchData();
      } else {
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating request data:", error);
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
      <Card>
        {loading ? (
          <p>
            <FormattedMessage id="app.loading" defaultMessage={"Loading..."} />
          </p>
        ) : request !== null && request.Employee ? (
          <>
            <Descriptions
              title={
                <FormattedMessage
                  id="app.request_info"
                  defaultMessage={"Request information"}
                />
              }
              column={1}
            >
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.last_name"
                    defaultMessage={"Last name"}
                  />
                }
              >
                {request.Employee.lastName}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.first_name"
                    defaultMessage={"First name"}
                  />
                }
              >
                {request.Employee.firstName}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.requestName"
                    defaultMessage={"Request name"}
                  />
                }
              >
                {request.requestName}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.description"
                    defaultMessage={"Description"}
                  />
                }
              >
                {request.description}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage id="app.status" defaultMessage={"Status"} />
                }
              >
                {request.requestStatus}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.requestDate"
                    defaultMessage={"Date the request was made"}
                  />
                }
              >
                <FormattedDate
                  value={new Date(request.createdAt)}
                  year="numeric"
                  month="long"
                  day="2-digit"
                  weekday="long"
                />
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.requestDateEnd"
                    defaultMessage={"Date the request was solved/denied"}
                  />
                }
              >
                {request.createdAt === request.updatedAt ? (
                  ""
                ) : (
                  <FormattedDate
                    value={new Date(request.updatedAt)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                    weekday="long"
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
            {request.requestStatus === "pending" && (
              <>
                <Button
                  type="primary"
                  style={{ background: "green", margin: "10px" }}
                  onClick={acceptRequest}
                >
                  <FormattedMessage id="app.accept" defaultMessage={"Accept"} />
                </Button>
                <Button
                  type="primary"
                  style={{ background: "red", margin: "10px" }}
                  onClick={denyRequest}
                >
                  <FormattedMessage id="app.deny" defaultMessage={"Deny"} />
                </Button>
              </>
            )}
          </>
        ) : (
          <p>
            <FormattedMessage
              id="app.hr.see_request.no_request"
              defaultMessage={"Request information missing."}
            />
          </p>
        )}
      </Card>
    </div>
  );
}

export default HrRequestPage;
