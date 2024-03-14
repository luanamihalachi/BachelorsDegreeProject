export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

export const extractedUserRole = () => {
  try {
    const token = localStorage.getItem("token");

    const userRole = JSON.parse(window.atob(token.split(".")[1])).userType;
    // console.log(userRole);
    return userRole;
  } catch (err) {
    console.log("Error decoding JWT token", err);
    return null;
  }
};
