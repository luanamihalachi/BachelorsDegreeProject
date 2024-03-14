import React, { useState } from "react";
import axios from "axios";

import { FormattedDate, FormattedMessage } from "react-intl";

import { Layout, Card, Typography, List } from "antd";
import BASE_API_URL from "../../util/config";

const { Content } = Layout;
const { Title, Text } = Typography;

function HrDashboard() {
  const [employeeName, setEmployeeName] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${BASE_API_URL}/api/hr/hr-employee-name`,
        {
          headers,
        }
      );

      setEmployeeName(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();

  return (
    <Content
      style={{
        marginLeft: "20%",
        padding: "20px",
        flexGrow: 1,
        marginTop: "20px",
      }}
    >
      <Card>
        <Title level={3}>
          <FormattedMessage
            id="app.hr.dashboard.greetings"
            defaultMessage="Welcome"
          />
          {employeeName ? `, ${employeeName}!` : "!"}
        </Title>
      </Card>
      <Card style={{ marginTop: "16px" }}>
        <Title level={3}>
          <FormattedMessage
            id="app.hr.dashboard.today_date"
            defaultMessage="Today's date"
          />
        </Title>
        <Text>
          {
            <FormattedDate
              value={new Date()}
              year="numeric"
              month="long"
              day="2-digit"
              weekday="long"
            />
          }
        </Text>
      </Card>

      <Card style={{ marginTop: "16px" }}>
        <Title level={3}>
          <FormattedMessage
            id="app.hr.dashboard.how_to_use"
            defaultMessage="Directions for use"
          />
        </Title>
        <Text>
          <FormattedMessage
            id="app.hr.dashboard.instructions_general"
            defaultMessage="On the left there is a menu which has multiple options available."
          />
        </Text>
        <List>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.dashboard.explanation"
              defaultMessage="HR Dashboard: HomePage of the application, where you can find a small guide on how to use the app."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.see_all_employees.explanation"
              defaultMessage="See all employees: Here you can find a list of all employees, you can filter them based on Department and click on them to see their respective profile."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.add_employee.explanation"
              defaultMessage="Enter new employee: The page where you can add a new employee to the company database."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.employee_requests.explanation"
              defaultMessage="See employee requests: You can access and filter the requests made by employees."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.pending_employee_requests.explanation"
              defaultMessage="Pending employee requests: You can view a list of pending requests from employees."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.personal_info.explanation"
              defaultMessage="See personal data: Here you can see your personal data and request changes to some of the information."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.attendance.explanation"
              defaultMessage="Attendance: You can check your attendance records and introduce a new time off request."
            />
          </List.Item>
          <List.Item>
            <FormattedMessage
              id="app.hr.nav.see_all_requests.explanation"
              defaultMessage="All requests: Here you can see a list of all your requests and their status."
            />
          </List.Item>
        </List>
      </Card>
    </Content>
  );
}

export default HrDashboard;
