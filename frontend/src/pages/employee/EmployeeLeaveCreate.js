import { Button, Card, DatePicker, Form, Input, Select } from "antd";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import BASE_API_URL from "../../util/config";

function EmployeeLeaveCreate() {
  const [form] = Form.useForm();
  const [leave, setLeave] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/employee/leaves/add`,
        leave,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(
          "leave added te redirectionez imd la pagina cu calendarul????"
        );
      } else {
        console.error("Invalid response status:", response.status);
      }
    } catch (error) {
      console.error("Error adding leave data:", error);
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
        <Form form={form}>
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
                setLeave({
                  ...leave,
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
                setLeave({
                  ...leave,
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
                setLeave({
                  ...leave,
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
                setLeave({
                  ...leave,
                  reason: value,
                })
              }
            >
              <Select.Option value="rest">rest</Select.Option>
              <Select.Option value="medical">medical</Select.Option>
              <Select.Option value="maternity">maternity</Select.Option>
              <Select.Option value="paternity">paternity</Select.Option>
              <Select.Option value="unpaid">unpaid</Select.Option>
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
                setLeave({
                  ...leave,
                  startDate: dateString,
                })
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <FormattedMessage id="app.endDate" defaultMessage={"End Date"} />
            }
          >
            <DatePicker
              onChange={(date, dateString) =>
                setLeave({
                  ...leave,
                  endDate: dateString,
                })
              }
            />
          </Form.Item>
        </Form>
        <Button type="primary" onClick={handleSubmit}>
          <FormattedMessage id="app.submit" defaultMessage={"Submit"} />
        </Button>
      </Card>
    </div>
  );
}

export default EmployeeLeaveCreate;
