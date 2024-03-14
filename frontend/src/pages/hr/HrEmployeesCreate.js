import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Input,
  Form,
  DatePicker,
  Select,
  message,
  Card,
} from "antd";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import BASE_API_URL_OCR from "../../util/config_ocr";
import BASE_API_URL from "../../util/config";

function HrEmployeesCreate() {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [form] = Form.useForm();
  const [editedEmployee, setEditedEmployee] = useState({});
  const [employee, setEmployee] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleImageSubmit = async () => {
    setSubmitPressed(true);
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const response = await fetch(`${BASE_API_URL_OCR}/api/upload-image/`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const employeeData = JSON.parse(data.ocr_result);
          setEmployee(employeeData);
          setEditedEmployee(employeeData);

          setLoading(false);
          setShowModal(true);
        } else {
          setLoading(false);
          console.error("Error uploading image:", response.statusText);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error uploading image:", error.message);
      }
    } else {
      setLoading(false);
      message.error("No image selected");
    }
  };

  const handleModalOk = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `${BASE_API_URL}/api/hr/employees/add`,
        JSON.stringify(editedEmployee),
        { headers }
      );

      if (response.status === 200) {
        setUserLogin(response.data);
        setShowUserLogin(true);
        console.log(userLogin);
      } else {
        message.error("Error when inserting user! Try again later!");
      }
    } catch (err) {
      message.error("Error when inserting user! Try again later!");
      console.log(err);
    }

    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleSkipPicture = () => {
    setLoading(false);
    setShowModal(true);
  };
  const handleModalUserLoginOk = () => {
    setShowUserLogin(false);
    navigate("/hr/employees");
  };
  const handleModalUserLoginCancel = () => {
    setShowUserLogin(false);
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(
        `Username: ${userLogin.username}\nPassword: ${userLogin.password}`
      )
      .then(() => {
        message.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        message.error("Failed to copy to clipboard");
      });
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
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        style={{ display: "none" }}
      />
      <Button onClick={() => inputRef.current.click()}>
        <FormattedMessage
          id="app.choose_image"
          defaultMessage={"Choose image"}
        />
      </Button>
      {selectedImage && (
        <div>
          <h4>
            <FormattedMessage
              id="app.selected_image"
              defaultMessage={"Selected image"}
            />
          </h4>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </div>
      )}
      <Button onClick={handleImageSubmit}>
        <FormattedMessage id="app.submit" defaultMessage={"Submit"} />
      </Button>
      <Button onClick={handleSkipPicture}>
        <FormattedMessage
          id="app.skip_picture"
          defaultMessage={"Skip picture"}
        />
      </Button>
      {loading && submitPressed && (
        <p>
          <FormattedMessage id="app.loading" defaultMessage={"Loading..."} />
        </p>
      )}
      {(employee || showModal) && (
        <Modal
          title="Additional Information"
          open={showModal}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <Form form={form} initialValues={employee}>
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
                  id="app.first_name"
                  defaultMessage={"First name"}
                />
              }
              name="firstName"
            >
              <Input
                onChange={(e) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    firstName: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Form.Item
              label={<FormattedMessage id="app.cnp" defaultMessage={"CNP"} />}
            >
              <Input
                onChange={(e) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    cnp: e.target.value,
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
                  id="app.dateOfBirth"
                  defaultMessage={"Date Of Birth"}
                />
              }
            >
              <DatePicker
                onChange={(date, dateString) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    dateOfBirth: dateString,
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
                <FormattedMessage id="app.country" defaultMessage={"Country"} />
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
              label={<FormattedMessage id="app.city" defaultMessage={"City"} />}
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
                <FormattedMessage id="app.address" defaultMessage={"Address"} />
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
                  id="app.departmentManager"
                  defaultMessage={"Department Manager"}
                />
              }
            >
              <Select
                onChange={(value) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    departmentManager: value,
                  })
                }
              >
                <Select.Option value="1">
                  <FormattedMessage id="app.yes" defaultMessage={"Yes"} />
                </Select.Option>
                <Select.Option value="0">
                  <FormattedMessage id="app.no" defaultMessage={"No"} />
                </Select.Option>
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
                  <FormattedMessage
                    id="app.fixed-term"
                    defaultMessage={"Fixed term"}
                  />
                </Select.Option>
                <Select.Option value="nedeterminata">
                  <FormattedMessage
                    id="app.indefinite"
                    defaultMessage={"Indefinite"}
                  />
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
                <FormattedMessage id="app.salary" defaultMessage={"Salary"} />
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
                  id="app.hireDate"
                  defaultMessage={"Hire Date"}
                />
              }
            >
              <DatePicker
                onChange={(date, dateString) =>
                  setEditedEmployee({
                    ...editedEmployee,
                    hireDate: dateString,
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
                <Select.Option value="active">
                  <FormattedMessage id="app.active" defaultMessage={"Active"} />
                </Select.Option>
                <Select.Option value="suspended">
                  <FormattedMessage
                    id="app.suspended"
                    defaultMessage={"Suspended"}
                  />
                </Select.Option>
                <Select.Option value="inactive">
                  <FormattedMessage
                    id="app.inactive"
                    defaultMessage={"Inactive"}
                  />
                </Select.Option>
                <Select.Option value="maternity">
                  <FormattedMessage
                    id="app.maternity"
                    defaultMessage={"Maternity"}
                  />
                </Select.Option>
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
                <Select.Option value="ended">
                  <FormattedMessage
                    id="app.ended"
                    defaultMessage={"Contract ended"}
                  />
                </Select.Option>
                <Select.Option value="fired">
                  <FormattedMessage id="app.fired" defaultMessage={"Fired"} />
                </Select.Option>
                <Select.Option value="retired">
                  <FormattedMessage
                    id="app.retired"
                    defaultMessage={"Retired"}
                  />
                </Select.Option>
                <Select.Option value="resigned">
                  <FormattedMessage
                    id="app.resigned"
                    defaultMessage={"Resigned"}
                  />
                </Select.Option>
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
      )}

      {showUserLogin && (
        <Modal
          title="Additional Information"
          open={showUserLogin}
          onOk={handleModalUserLoginOk}
          onCancel={handleModalUserLoginCancel}
        >
          <Card>
            {userLogin && (
              <>
                <p>
                  <FormattedMessage
                    id="app.username"
                    defaultMessage={"Username"}
                  />
                  : {userLogin.username}
                </p>
                <p>
                  <FormattedMessage
                    id="app.password"
                    defaultMessage={"Password"}
                  />
                  : {userLogin.password}
                </p>
                <Button key="copy" type="primary" onClick={handleCopy}>
                  <FormattedMessage
                    id="app.copy_test"
                    defaultMessage={"Copy text"}
                  />
                </Button>
              </>
            )}
          </Card>
        </Modal>
      )}
    </div>
  );
}

export default HrEmployeesCreate;
