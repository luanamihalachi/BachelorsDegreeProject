const Attendance = require("../models/attendance");
const Employee = require("../models/employee");
const Leave = require("../models/leave");
const Request = require("../models/request");
const User = require("../models/user");

exports.getRequests = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const requests = await Request.findAll({
      where: { employeeId: employeeId },
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequestById = async (req, res, next) => {
  const { requestId } = req.params;
  const employeeId = req.employeeId;

  try {
    const request = await Request.findOne({
      where: { requestId: requestId },
    });
    res.status(200).json(request);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEmployeeName = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const employee = await Employee.findOne({
      where: { employeeId: employeeId },
      attributes: ["lastName", "firstName"],
    });
    const employeeName = employee.lastName + " " + employee.firstName;
    res.status(200).json(employeeName);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPersonalInfo = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const data = await Employee.findOne({
      where: { employeeId: employeeId },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postLeave = async (req, res, next) => {
  try {
    await Leave.create({
      employeeId: req.employeeId,
      leaveName: req.body.leaveName,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      department: req.body.department,
      status: "pending",
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postAttendance = async (req, res, next) => {
  try {
    const timeDifference =
      (new Date(`2000-01-01T${req.body.endTime}`) -
        new Date(`2000-01-01T${req.body.startTime}`)) /
      (1000 * 60 * 60);
    await Attendance.create({
      employeeId: req.employeeId,
      attendanceDate: req.body.attendanceDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      workedTime: timeDifference,
      modeAdded: "manual",
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLeaves = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const employee = await Employee.findOne({
      where: { employeeId: employeeId },
      attributes: ["department"],
    });
    const department = employee.department;
    console.log(department);
    const leaves = await Leave.findAll({
      where: { status: "pending", department: department },
      include: [
        {
          model: Employee,
          attributes: ["lastName", "firstName"],
        },
      ],
    });
    res.status(200).json(leaves);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postRequest = async (req, res, next) => {
  try {
    Request.create({
      employeeId: req.employeeId,
      requestName: req.body.requestName,
      requestStatus: "pending",
      description: req.body.description,
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.patchEditLeaveStatus = async (req, res, next) => {
  const { leaveId } = req.params;
  const updatedFields = req.body;
  console.log(leaveId);
  console.log(updatedFields);
  try {
    const [updatedRowsCount] = await Leave.update(updatedFields, {
      where: { leaveId },
    });

    const updatedLeave = await Leave.findOne({ where: { leaveId } });
    if (updatedRowsCount > 0 && updatedLeave) {
      res.status(200).json({
        success: true,
        message: "Leave updated successfully",
        leave: updatedLeave,
      });
    } else {
      res.status(404).json({
        error: "No changes made or leave not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLeavesByEmployeeId = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const leaves = await Leave.findAll({
      where: { employeeId, status: "solved" },
    });
    res.status(200).json(leaves);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAttendancesByEmployeeId = async (req, res, next) => {
  try {
    const employeeId = req.employeeId;
    const attendances = [];
    const { count, rows } = await Attendance.findAndCountAll({
      where: { employeeId },
    });
    for (index = 0; index < count; index++)
      if (rows[index].endTime != null) {
        attendances.push(rows[index]);
      }
    res.status(200).json(attendances);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
