const express = require("express");

const employeeController = require("../controllers/employee");

const authenticationMiddleware = require("../middleware/is-authenticated");
const authorizationMiddleware = require("../middleware/is-authorized");
const extractedEmployeeIdMiddleware = require("../middleware/extractedEmployeeId");

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizationMiddleware(["employee", "hr"]));

router.get(
  "/personal-info",
  extractedEmployeeIdMiddleware,
  employeeController.getPersonalInfo
);

router.get(
  "/requests",
  extractedEmployeeIdMiddleware,
  employeeController.getRequests
);

router.get(
  "/leaves",
  extractedEmployeeIdMiddleware,
  employeeController.getLeaves
);

router.get(
  "/requests/:requestId",
  extractedEmployeeIdMiddleware,
  employeeController.getRequestById
);

router.get(
  "/employee-name",
  extractedEmployeeIdMiddleware,
  employeeController.getEmployeeName
);

router.post(
  "/leaves/add",
  extractedEmployeeIdMiddleware,
  employeeController.postLeave
);

router.post(
  "/attendances/add",
  extractedEmployeeIdMiddleware,
  employeeController.postAttendance
);

router.post(
  "/requests/add",
  extractedEmployeeIdMiddleware,
  employeeController.postRequest
);

router.get(
  "/personal-leaves",
  extractedEmployeeIdMiddleware,
  employeeController.getLeavesByEmployeeId
);

router.get(
  "/personal-attendances",
  extractedEmployeeIdMiddleware,
  employeeController.getAttendancesByEmployeeId
);

router.patch("/leaves/edit/:leaveId", employeeController.patchEditLeaveStatus);

module.exports = router;
