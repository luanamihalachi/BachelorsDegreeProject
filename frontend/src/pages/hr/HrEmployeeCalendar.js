import React, { useState, useEffect, useRef } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Button, Card } from "antd";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import BASE_API_URL from "../../util/config";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";

const HrEmployeeCalendar = () => {
  const { username } = useParams();
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [attendancesLoading, setAttendancesLoading] = useState(true);
  const [leaves, setLeaves] = useState(null);
  const [attendances, setAttendances] = useState(null);
  const token = localStorage.getItem("token");

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/hr/employees/leaves/${username}`,
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
        `${BASE_API_URL}/api/hr/employees/attendances/${username}`,
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
        </>
      )}
    </div>
  );
};

export default HrEmployeeCalendar;
