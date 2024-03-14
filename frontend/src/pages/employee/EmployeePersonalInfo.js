import React, { useState, useEffect } from "react";
import axios from "axios";

import { Card, Descriptions, Modal, Button, Form, Input } from "antd";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import BASE_API_URL from "../../util/config";

function EmployeePersonalInfo() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [request, setRequest] = useState({});
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/employee/personal-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = () => {
    setEditModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/employee/requests/add`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditModalVisible(false);
        fetchData();
      } else {
        setEditModalVisible(false);
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      setEditModalVisible(false);
      console.error("Error adding request data:", error);
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
        ) : employee !== null ? (
          <>
            <Descriptions
              title={
                <FormattedMessage
                  id="app.employee_info"
                  defaultMessage={"Employee information"}
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
                {employee.lastName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.first_name"
                    defaultMessage={"First name"}
                  />
                }
              >
                {employee.firstName}
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage id="app.cnp" defaultMessage={"CNP"} />}
              >
                {employee.CNP}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.idCardInfo"
                    defaultMessage={"ID Card information"}
                  />
                }
              >
                {employee.idCardInfo}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.dateOfBirth"
                    defaultMessage={"Date Of Birth"}
                  />
                }
              >
                {employee.dateOfBirth && (
                  <FormattedDate
                    value={new Date(employee.dateOfBirth)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                    weekday="long"
                  />
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.languages"
                    defaultMessage={"Spoken foreign languages"}
                  />
                }
              >
                {employee.languages}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.workEmail"
                    defaultMessage={"Work Email"}
                  />
                }
              >
                {employee.workEmail}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.workPhoneNumber"
                    defaultMessage={"Work Phone Number"}
                  />
                }
              >
                {employee.workPhoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.personalEmail"
                    defaultMessage={"Personal Email"}
                  />
                }
              >
                {employee.personalEmail}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.personalPhoneNumber"
                    defaultMessage={"Personal Phone Number"}
                  />
                }
              >
                {employee.personalPhoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.country"
                    defaultMessage={"Country"}
                  />
                }
              >
                {employee.country}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage id="app.city" defaultMessage={"City"} />
                }
              >
                {employee.city}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.address"
                    defaultMessage={"Address"}
                  />
                }
              >
                {employee.address}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.department"
                    defaultMessage={"Department"}
                  />
                }
              >
                {employee.department}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.job_title"
                    defaultMessage={"Job title"}
                  />
                }
              >
                {employee.jobTitle}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.educationBackground"
                    defaultMessage={"Education Background"}
                  />
                }
              >
                {employee.educationBackground}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.trainingBackground"
                    defaultMessage={"Training Background"}
                  />
                }
              >
                {employee.trainingBackground}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.certifications"
                    defaultMessage={"Certifications"}
                  />
                }
              >
                {employee.certifications}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.contractPeriod"
                    defaultMessage={"Contract Period"}
                  />
                }
              >
                {employee.contractPeriod}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.expectedLeaveDate"
                    defaultMessage={"Expected Leave Date"}
                  />
                }
              >
                {employee.expectedLeaveDate && (
                  <FormattedDate
                    value={new Date(employee.expectedLeaveDate)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                    weekday="long"
                  />
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.hoursPerWeek"
                    defaultMessage={"Hours/Week"}
                  />
                }
              >
                {employee.hoursPerWeek}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage id="app.salary" defaultMessage={"Salary"} />
                }
              >
                {employee.salary}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.totalVacationDays"
                    defaultMessage={"Total vacation days"}
                  />
                }
              >
                {employee.totalVacationDays}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.hireDate"
                    defaultMessage={"Hire Date"}
                  />
                }
              >
                {employee.hireDate && (
                  <FormattedDate
                    value={new Date(employee.hireDate)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                    weekday="long"
                  />
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.employeeStatus"
                    defaultMessage={"Employee status"}
                  />
                }
              >
                {employee.employeeStatus}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.workExperience"
                    defaultMessage={"Work experience - in years"}
                  />
                }
              >
                {employee.workExperience}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.childrenCount"
                    defaultMessage={"Children count"}
                  />
                }
              >
                {employee.childrenCount}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.dependentsCount"
                    defaultMessage={"Dependents count"}
                  />
                }
              >
                {employee.dependentsCount}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.emergencyContactName"
                    defaultMessage={"Emergency contact name"}
                  />
                }
              >
                {employee.emergencyContactName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.emergencyContactPhoneNumber"
                    defaultMessage={"Emergency contact phone number"}
                  />
                }
              >
                {employee.emergencyContactPhoneNumber}
              </Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={handleCreateRequest}>
              <FormattedMessage
                id="app.employee.personal_info.create_request"
                defaultMessage={"Create request to change personal data"}
              />
            </Button>
            <Modal
              title={
                <FormattedMessage
                  id="app.request_info"
                  defaultMessage={"Request information"}
                />
              }
              open={editModalVisible}
              onOk={handleOk}
              onCancel={() => setEditModalVisible(false)}
            >
              <Form form={form}>
                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.requestName"
                      defaultMessage={"Request name"}
                    />
                  }
                >
                  <Input
                    onChange={(e) =>
                      setRequest({
                        ...request,
                        requestName: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.description"
                      defaultMessage={"Description"}
                    />
                  }
                >
                  <Input
                    onChange={(e) =>
                      setRequest({
                        ...request,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : (
          <p>
            <FormattedMessage
              id="app.hr.see_employee.no_employee"
              defaultMessage={
                "We are currently experiencing an issue and can't provide the employee information. Please come back later."
              }
            />
          </p>
        )}
      </Card>
    </div>
  );
}

export default EmployeePersonalInfo;
