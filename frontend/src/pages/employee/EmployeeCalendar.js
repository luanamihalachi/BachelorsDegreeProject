import React, { useState, useEffect, useRef } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Input,
  Modal,
  Select,
  Form,
  TimePicker,
} from "antd";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";
import ReactToPrint from "react-to-print";

const EmployeeCalendar = () => {
  const [leavesForm] = Form.useForm();
  const [attendancesForm] = Form.useForm();
  const [newLeave, setNewLeave] = useState(null);
  const [newAttendance, setNewAttendance] = useState(null);
  const [createLeaveModal, setCreateLeaveModal] = useState(false);
  const [createAttendanceModal, setCreateAttendanceModal] = useState(false);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [attendancesLoading, setAttendancesLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/employee/personal-leaves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLeavesLoading(false);
    }
  };

  const fetchAttendancesData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/employee/personal-attendances`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendances(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setAttendancesLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
    fetchAttendancesData();
  }, []);

  const dayPropGetter = (dateObject) => {
    const dateToCheck = moment(dateObject);
    const currentDate = moment();
    const isWeekend = dateToCheck.day() === 6 || dateToCheck.day() === 0;
    const isDateMedical = leaves.some((item) => {
      const startDate = moment(item.startDate);
      const endDate = moment(item.endDate);

      return (
        dateToCheck.isBetween(
          startDate.clone().subtract(1, "day"),
          endDate,
          null,
          "[]",
          "day"
        ) &&
        !isWeekend &&
        item.reason === "medical"
      );
    });

    const isDateLeave = leaves.some((item) => {
      const startDate = moment(item.startDate);
      const endDate = moment(item.endDate);

      return (
        dateToCheck.isBetween(
          startDate.clone().subtract(1, "day"),
          endDate,
          null,
          "[]",
          "day"
        ) && !isWeekend
      );
    });
    const isDateAttendance = attendances.some((item) => {
      const checkDate = moment(item.attendanceDate);

      return dateToCheck.isSame(checkDate, "day") && !isWeekend;
    });

    const isDatePassed = dateToCheck.isBefore(currentDate) && !isWeekend;

    if (isWeekend) {
      return {
        style: { backgroundColor: "#e6e6e6" },
      };
    } else if (isDateMedical) {
      return {
        style: {
          backgroundColor: "lightblue",
        },
      };
    } else if (isDateLeave) {
      return {
        style: {
          backgroundColor: "yellow",
        },
      };
    } else if (isDateAttendance) {
      return {
        style: {
          backgroundColor: "green",
        },
      };
    }
    // else if (isDatePassed) {
    //   return {
    //     style: {
    //       backgroundColor: "red",
    //     },
    //   };
    // }

    return {};
  };

  const handleCreateLeave = () => {
    setCreateLeaveModal(true);
  };

  const handleCreateAttendance = () => {
    setCreateAttendanceModal(true);
  };

  const handleSubmitLeave = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/employee/leaves/add`,
        newLeave,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCreateLeaveModal(false);
        fetchLeaveData();
      } else {
        setCreateLeaveModal(false);
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      setCreateLeaveModal(false);
      console.error("Error adding leave data:", error);
    }
  };

  const handleSubmitAttendance = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/employee/attendances/add`,
        newAttendance,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCreateAttendanceModal(false);
        fetchAttendancesData();
      } else {
        setCreateAttendanceModal(false);
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      setCreateAttendanceModal(false);
      console.error("Error adding leave data:", error);
    }
  };

  const calendarRef = useRef(null);

  return (
    <div
      style={{
        marginLeft: "20%",
        padding: "20px",
        flexGrow: 1,
        marginTop: "20px",
      }}
    >
      {leavesLoading || attendancesLoading ? (
        <p>
          <FormattedMessage id="app.loading" defaultMessage={"Loading..."} />
        </p>
      ) : (
        <>
          <Card ref={calendarRef}>
            <BigCalendar
              localizer={momentLocalizer(moment)}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, marginTop: 20 }}
              views={["month"]}
              dayPropGetter={dayPropGetter}
            />
          </Card>
          <Button type="primary" onClick={handleCreateLeave}>
            <FormattedMessage
              id="app.add_leave"
              defaultMessage={"Make time off request"}
            />
          </Button>
          <Divider />
          <Button type="primary" onClick={handleCreateAttendance}>
            <FormattedMessage
              id="app.modify_attendance"
              defaultMessage={"Modify attendance"}
            />
          </Button>
          <Divider />
          <ReactToPrint
            trigger={() => (
              <Button type="primary">
                <FormattedMessage
                  id="app.export_calendar"
                  defaultMessage={"Export attendance"}
                />
              </Button>
            )}
            content={() => calendarRef.current}
          />

          <Modal
            title={
              <FormattedMessage
                id="app.leave_request_info"
                defaultMessage={"Time off request information"}
              />
            }
            open={createLeaveModal}
            onOk={handleSubmitLeave}
            onCancel={() => setCreateLeaveModal(false)}
          >
            <Form form={leavesForm}>
              <Form.Item
                label={
                  <FormattedMessage
                    id="app.leavetitle"
                    defaultMessage={"Leave Title"}
                  />
                }
              >
                <Input
                  onChange={(e) =>
                    setNewLeave({
                      ...newLeave,
                      leaveName: e.target.value,
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
                    setNewLeave({
                      ...newLeave,
                      description: e.target.value,
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
                    setNewLeave({
                      ...newLeave,
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
                  <FormattedMessage id="app.reason" defaultMessage={"Reason"} />
                }
              >
                <Select
                  onChange={(value) =>
                    setNewLeave({
                      ...newLeave,
                      reason: value,
                    })
                  }
                >
                  <Select.Option value="rest">
                    <FormattedMessage id="app.rest" defaultMessage={"Rest"} />
                  </Select.Option>
                  <Select.Option value="medical">
                    <FormattedMessage
                      id="app.medical"
                      defaultMessage={"Medical"}
                    />
                  </Select.Option>
                  <Select.Option value="maternity">
                    <FormattedMessage
                      id="app.maternity"
                      defaultMessage={"Maternity"}
                    />
                  </Select.Option>
                  <Select.Option value="paternity">
                    <FormattedMessage
                      id="app.paternity"
                      defaultMessage={"Paternity"}
                    />
                  </Select.Option>
                  <Select.Option value="unpaid">
                    <FormattedMessage
                      id="app.unpaid"
                      defaultMessage={"Unpaid"}
                    />
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage
                    id="app.startDate"
                    defaultMessage={"Start Date"}
                  />
                }
              >
                <DatePicker
                  onChange={(date, dateString) =>
                    setNewLeave({
                      ...newLeave,
                      startDate: dateString,
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                label={
                  <FormattedMessage
                    id="app.endDate"
                    defaultMessage={"End Date"}
                  />
                }
              >
                <DatePicker
                  onChange={(date, dateString) =>
                    setNewLeave({
                      ...newLeave,
                      endDate: dateString,
                    })
                  }
                />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={
              <FormattedMessage
                id="app.attendance_info"
                defaultMessage={"Attendance information"}
              />
            }
            open={createAttendanceModal}
            onOk={handleSubmitAttendance}
            onCancel={() => setCreateAttendanceModal(false)}
          >
            <Form form={attendancesForm}>
              <Form.Item
                label={
                  <FormattedMessage id="app.date" defaultMessage={"Date"} />
                }
              >
                <DatePicker
                  onChange={(date, dateString) =>
                    setNewAttendance({
                      ...newAttendance,
                      attendanceDate: dateString,
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label={
                  <FormattedMessage
                    id="app.startTime"
                    defaultMessage={"Start time"}
                  />
                }
              >
                <TimePicker
                  onChange={(time, timeString) =>
                    setNewAttendance({
                      ...newAttendance,
                      startTime: timeString,
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                label={
                  <FormattedMessage
                    id="app.endTime"
                    defaultMessage={"End time"}
                  />
                }
              >
                <TimePicker
                  onChange={(time, timeString) =>
                    setNewAttendance({
                      ...newAttendance,
                      endTime: timeString,
                    })
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default EmployeeCalendar;
