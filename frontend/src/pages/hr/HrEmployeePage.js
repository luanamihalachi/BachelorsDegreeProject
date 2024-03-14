import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Card,
  Descriptions,
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
} from "antd";
import { FormattedDate, FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";

function HrEmployeePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { username } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({});
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/hr/employees/${username}`,
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

  const handleEditClick = () => {
    setEditedEmployee({ ...employee.Employee });
    setEditModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const response = await axios.patch(
        `${BASE_API_URL}/api/hr/employees/edit/${employee.employeeId}`,
        editedEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEmployee(response.data.employee);
        setEditModalVisible(false);
        fetchData();
      } else {
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  const seeLeaves = () => {
    navigate(`/hr/employees/calendar/${username}`);
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
        ) : employee !== null && employee.Employee ? (
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
                {employee.Employee.lastName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.first_name"
                    defaultMessage={"First name"}
                  />
                }
              >
                {employee.Employee.firstName}
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage id="app.cnp" defaultMessage={"CNP"} />}
              >
                {employee.Employee.CNP}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.idCardInfo"
                    defaultMessage={"ID Card information"}
                  />
                }
              >
                {employee.Employee.idCardInfo}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.dateOfBirth"
                    defaultMessage={"Date Of Birth"}
                  />
                }
              >
                {employee.Employee.dateOfBirth && (
                  <FormattedDate
                    value={new Date(employee.Employee.dateOfBirth)}
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
                {employee.Employee.languages}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.workEmail"
                    defaultMessage={"Work Email"}
                  />
                }
              >
                {employee.Employee.workEmail}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.workPhoneNumber"
                    defaultMessage={"Work Phone Number"}
                  />
                }
              >
                {employee.Employee.workPhoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.personalEmail"
                    defaultMessage={"Personal Email"}
                  />
                }
              >
                {employee.Employee.personalEmail}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.personalPhoneNumber"
                    defaultMessage={"Personal Phone Number"}
                  />
                }
              >
                {employee.Employee.personalPhoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.country"
                    defaultMessage={"Country"}
                  />
                }
              >
                {employee.Employee.country}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage id="app.city" defaultMessage={"City"} />
                }
              >
                {employee.Employee.city}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.address"
                    defaultMessage={"Address"}
                  />
                }
              >
                {employee.Employee.address}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.department"
                    defaultMessage={"Department"}
                  />
                }
              >
                {employee.Employee.department}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.job_title"
                    defaultMessage={"Job title"}
                  />
                }
              >
                {employee.Employee.jobTitle}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.educationBackground"
                    defaultMessage={"Education Background"}
                  />
                }
              >
                {employee.Employee.educationBackground}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.trainingBackground"
                    defaultMessage={"Training Background"}
                  />
                }
              >
                {employee.Employee.trainingBackground}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.certifications"
                    defaultMessage={"Certifications"}
                  />
                }
              >
                {employee.Employee.certifications}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.contractPeriod"
                    defaultMessage={"Contract Period"}
                  />
                }
              >
                {employee.Employee.contractPeriod}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.expectedLeaveDate"
                    defaultMessage={"Expected Leave Date"}
                  />
                }
              >
                {employee.Employee.expectedLeaveDate && (
                  <FormattedDate
                    value={new Date(employee.Employee.expectedLeaveDate)}
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
                {employee.Employee.hoursPerWeek}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage id="app.salary" defaultMessage={"Salary"} />
                }
              >
                {employee.Employee.salary}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.totalVacationDays"
                    defaultMessage={"Total vacation days"}
                  />
                }
              >
                {employee.Employee.totalVacationDays}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.hireDate"
                    defaultMessage={"Hire Date"}
                  />
                }
              >
                {employee.Employee.hireDate && (
                  <FormattedDate
                    value={new Date(employee.Employee.hireDate)}
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
                {employee.Employee.employeeStatus}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.leaveDate"
                    defaultMessage={"Leave date"}
                  />
                }
              >
                {employee.Employee.leaveDate && (
                  <FormattedDate
                    value={new Date(employee.Employee.leaveDate)}
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
                    id="app.reasonForLeaving"
                    defaultMessage={"Reason for leaving"}
                  />
                }
              >
                {employee.Employee.reasonForLeaving}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.exitInterviewNotes"
                    defaultMessage={"Exit interview notes"}
                  />
                }
              >
                {employee.Employee.exitInterviewNotes}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.workExperience"
                    defaultMessage={"Work experience - in years"}
                  />
                }
              >
                {employee.Employee.workExperience}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.childrenCount"
                    defaultMessage={"Children count"}
                  />
                }
              >
                {employee.Employee.childrenCount}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.dependentsCount"
                    defaultMessage={"Dependents count"}
                  />
                }
              >
                {employee.Employee.dependentsCount}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.emergencyContactName"
                    defaultMessage={"Emergency contact name"}
                  />
                }
              >
                {employee.Employee.emergencyContactName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <FormattedMessage
                    id="app.emergencyContactPhoneNumber"
                    defaultMessage={"Emergency contact phone number"}
                  />
                }
              >
                {employee.Employee.emergencyContactPhoneNumber}
              </Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={handleEditClick}>
              <FormattedMessage id="app.edit" defaultMessage={"Edit"} />
            </Button>
            <Divider />
            <Button type="primary" onClick={seeLeaves}>
              <FormattedMessage
                id="app.hr.see_time_off"
                defaultMessage={"See attendance"}
              />
            </Button>
            <Modal
              title={
                <FormattedMessage
                  id="app.edit_employee"
                  defaultMessage={"Edit employee information"}
                />
              }
              open={editModalVisible}
              onOk={handleOk}
              onCancel={() => setEditModalVisible(false)}
            >
              <Form form={form} initialValues={editedEmployee}>
                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.last_name"
                      defaultMessage={"Last name"}
                    />
                  }
                  name="lastName"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        lastName: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.idCardInfo"
                      defaultMessage={"ID Card information"}
                    />
                  }
                  name="idCardInfo"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        idCardInfo: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.languages"
                      defaultMessage={"Languages"}
                    />
                  }
                  name="languages"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        languages: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.workEmail"
                      defaultMessage={"Work Email"}
                    />
                  }
                  name="workEmail"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        workEmail: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.workPhoneNumber"
                      defaultMessage={"Work Phone Number"}
                    />
                  }
                  name="workPhoneNumber"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        workPhoneNumber: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.personalEmail"
                      defaultMessage={"Personal Email"}
                    />
                  }
                  name="personalEmail"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        personalEmail: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.personalPhoneNumber"
                      defaultMessage={"Personal Phone Number"}
                    />
                  }
                  name="personalPhoneNumber"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        personalPhoneNumber: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.country"
                      defaultMessage={"Country"}
                    />
                  }
                  name="country"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        country: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage id="app.city" defaultMessage={"City"} />
                  }
                  name="city"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        city: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.address"
                      defaultMessage={"Address"}
                    />
                  }
                  name="address"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        address: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.department"
                      defaultMessage={"Department"}
                    />
                  }
                  name="department"
                >
                  <Select
                    onChange={(value) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        department: value,
                      })
                    }
                  >
                    <Select.Option value="HR">HR</Select.Option>
                    <Select.Option value="IT">IT</Select.Option>
                    <Select.Option value="Finance">Finance</Select.Option>
                    <Select.Option value="Marketing">Marketing</Select.Option>
                    <Select.Option value="Legal">Legal</Select.Option>
                    <Select.Option value="Management">Management</Select.Option>
                    <Select.Option value="PR">PR</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.job_title"
                      defaultMessage={"Job title"}
                    />
                  }
                  name="jobTitle"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        jobTitle: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.educationBackground"
                      defaultMessage={"Education Background"}
                    />
                  }
                  name="educationBackground"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        educationBackground: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.trainingBackground"
                      defaultMessage={"Training Background"}
                    />
                  }
                  name="trainingBackground"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        trainingBackground: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.certifications"
                      defaultMessage={"Certifications"}
                    />
                  }
                  name="certifications"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        certifications: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.contractPeriod"
                      defaultMessage={"Contract Period"}
                    />
                  }
                  name="contractPeriod"
                >
                  <Select
                    onChange={(value) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        contractPeriod: value,
                      })
                    }
                  >
                    <Select.Option value="determinata">
                      determinata
                    </Select.Option>
                    <Select.Option value="nedeterminata">
                      nedeterminata
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.expectedLeaveDate"
                      defaultMessage={"Expected Leave Date"}
                    />
                  }
                >
                  <DatePicker
                    onChange={(date, dateString) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        expectedLeaveDate: dateString,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.hoursPerWeek"
                      defaultMessage={"Hours/Week"}
                    />
                  }
                  name="hoursPerWeek"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        hoursPerWeek: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.salary"
                      defaultMessage={"Salary"}
                    />
                  }
                  name="salary"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        salary: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.totalVacationDays"
                      defaultMessage={"Total vacation days"}
                    />
                  }
                  name="totalVacationDays"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        totalVacationDays: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.employeeStatus"
                      defaultMessage={"Employee status"}
                    />
                  }
                  name="employeeStatus"
                >
                  <Select
                    onChange={(value) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        employeeStatus: value,
                      })
                    }
                  >
                    <Select.Option value="active">active</Select.Option>
                    <Select.Option value="suspended">suspended</Select.Option>
                    <Select.Option value="inactive">inactive</Select.Option>
                    <Select.Option value="maternity">maternity</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.leaveDate"
                      defaultMessage={"Leave Date"}
                    />
                  }
                >
                  <DatePicker
                    onChange={(date, dateString) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        leaveDate: dateString,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.reasonForLeaving"
                      defaultMessage={"Reason for leaving"}
                    />
                  }
                  name="reasonForLeaving"
                >
                  <Select
                    onChange={(value) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        reasonForLeaving: value,
                      })
                    }
                  >
                    <Select.Option value="ended">ended</Select.Option>
                    <Select.Option value="fired">fired</Select.Option>
                    <Select.Option value="retired">retired</Select.Option>
                    <Select.Option value="resigned">resigned</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.exitInterviewNotes"
                      defaultMessage={"Exit interview notes"}
                    />
                  }
                  name="exitInterviewNotes"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        exitInterviewNotes: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.childrenCount"
                      defaultMessage={"Children count"}
                    />
                  }
                  name="childrenCount"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        childrenCount: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.dependentsCount"
                      defaultMessage={"Dependents count"}
                    />
                  }
                  name="dependentsCount"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        dependentsCount: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.emergencyContactName"
                      defaultMessage={"Emergency contact name"}
                    />
                  }
                  name="emergencyContactName"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        emergencyContactName: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <FormattedMessage
                      id="app.emergencyContactPhoneNumber"
                      defaultMessage={"Emergency contact phone number"}
                    />
                  }
                  name="emergencyContactPhoneNumber"
                >
                  <Input
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        emergencyContactPhoneNumber: e.target.value,
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
              defaultMessage={"Employee information missing."}
            />
          </p>
        )}
      </Card>
    </div>
  );
}

export default HrEmployeePage;
