const express = require("express");

const hrController = require("../controllers/hr");

const authenticationMiddleware = require("../middleware/is-authenticated");
const authorizationMiddleware = require("../middleware/is-authorized");
const extractedEmployeeIdMiddleware = require("../middleware/extractedEmployeeId");

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizationMiddleware(["hr"]));

router.get("/employees", hrController.getEmployees);

router.get("/requests", hrController.getRequests);

router.get("/requests/pending", hrController.getPendingRequests);

router.post("/employees/add", hrController.postNewEmployee);

router.get(
  "/certificates/create",
  extractedEmployeeIdMiddleware,
  hrController.getEmployeeCertificatesNew
);

router.patch("/employees/edit/:employeeId", hrController.patchEditEmployee);

router.patch("/requests/edit/:requestId", hrController.patchEditRequestStatus);

router.get(
  "/hr-employee-name",
  extractedEmployeeIdMiddleware,
  hrController.getHREmployeeName
);

router.get("/employees/:username", hrController.getEmployeeByUsername);

router.get("/requests/:requestId", hrController.getRequestById);

router.get("/employee-name", hrController.getEmployeeName);

router.get("/employees/leaves/:username", hrController.getLeavesByUsername);

router.get(
  "/employees/attendances/:username",
  hrController.getAttendancesByUsername
);

module.exports = router;
