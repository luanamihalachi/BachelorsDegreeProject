import AuthForm from "../../components/login/AuthForm";
import { json } from "react-router-dom";
import { extractedUserRole } from "../../util/auth";
import BASE_API_URL from "../../util/config";

function AuthPage() {
  return <AuthForm />;
}

export default AuthPage;

export async function action({ username, password }) {
  const authData = {
    username: username,
    password: password,
  };
  const response = await fetch(`${BASE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not authenticate user." }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);
  if (extractedUserRole() === "hr") {
    return { redirect: "/hr/dashboard" };
  } else if (extractedUserRole() === "employee")
    return { redirect: "/employee/dashboard" };
}
