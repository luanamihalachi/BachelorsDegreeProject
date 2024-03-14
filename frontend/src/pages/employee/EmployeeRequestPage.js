import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Descriptions } from "antd";
import { FormattedDate, FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function EmployeeRequestPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/employee/requests/${requestId}`,
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
        ) : request !== null ? (
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
          </>
        ) : (
          <p>
            <FormattedMessage
              id="app.hr.see_request.no_request"
              defaultMessage={
                "We are currently experiencing an issue and can't provide the request information. Please come back later."
              }
            />
          </p>
        )}
      </Card>
    </div>
  );
}

export default EmployeeRequestPage;
