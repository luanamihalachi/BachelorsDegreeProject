import React from "react";
import { Form, Input, Button } from "antd";
import { useIntl } from "react-intl";
import { action as authAction } from "../../pages/login/Authentication";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const onFinish = async (values) => {
    try {
      const redirectInfo = await authAction(values);

      if (redirectInfo && redirectInfo.redirect) {
        navigate(redirectInfo.redirect);
      } else {
        setErrorMessage(
          intl.formatMessage(
            { id: "app.username_password_wrong" },
            {
              defaultMessage:
                "Login failed. Please check your username and password!",
            }
          )
        );
      }
    } catch (error) {
      console.error("Authentication failed:", error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
          width: "300px",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: "app.username_missing" },
                { defaultMessage: "Please input your username!" }
              ),
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage(
              { id: "app.username" },
              { defaultMessage: "Username" }
            )}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: "app.password_missing" },
                { defaultMessage: "Please input your password!" }
              ),
            },
          ]}
        >
          <Input.Password
            placeholder={intl.formatMessage(
              { id: "app.password" },
              { defaultMessage: "Password" }
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage(
              { id: "app.login" },
              { defaultMessage: "Log in" }
            )}
          </Button>
        </Form.Item>

        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Form>
    </div>
  );
};

export default LoginForm;
