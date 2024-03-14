import React, { useState } from "react";
import axios from "axios";

import { FormattedDate, FormattedMessage } from "react-intl";

import { Layout, Card, Typography, List } from "antd";
import BASE_API_URL from "../../util/config";

const { Content } = Layout;
const { Title, Text } = Typography;

function EmployeeDashboard() {
  const [employeeName, setEmployeeName] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${BASE_API_URL}/api/employee/employee-name`,
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
              id="app.employee.nav.dashboard.explanation"
              defaultMessage="Dashboard: HomePage of the application, where you can find a small guide on how to use the app."
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

export default EmployeeDashboard;
