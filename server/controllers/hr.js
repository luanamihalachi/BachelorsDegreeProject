const Employee = require("../models/employee");
const Request = require("../models/request");
const Leave = require("../models/leave");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const QRCode = require("qrcode-svg");
const Attendance = require("../models/attendance");

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: Employee,
          attributes: ["lastName", "firstName", "department"],
        },
      ],
    });

    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPendingRequests = async (req, res, next) => {
  try {
    const requests = await Request.findAll({
      where: { requestStatus: "pending" },
      include: [
        {
          model: Employee,
          attributes: ["lastName", "firstName", "department"],
        },
      ],
    });
    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postNewEmployee = async (req, res, next) => {
  try {
    console.log(req.body);
    //check if certain fields are missing
    if (!req.body.lastName || !req.body.firstName) {
      res.status(400).json({ error: "Missing fields!" });
      return;
    }
    //create employee

    const newEmployee = await Employee.create({
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      CNP: req.body.CNP,
      idCardInfo: req.body.idCardInfo,
      dateOfBirth: req.body.dateOfBirth,
      languages: req.body.languages,
      workEmail: req.body.workEmail,
      workPhoneNumber: req.body.workPhoneNumber,
      personalEmail: req.body.personalEmail,
      personalPhoneNumber: req.body.personalPhoneNumber,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      department: req.body.department,
      jobTitle: req.body.jobTitle,
      educationBackground: req.body.educationBackground,
      trainingBackground: req.body.trainingBackground,
      certifications: req.body.certifications,
      contractPeriod: req.body.contractPeriod,
      expectedLeaveDate: req.body.expectedLeaveDate,
      hoursPerWeek: req.body.hoursPerWeek,
      salary: req.body.salary,
      totalVacationDays: req.body.totalVacationDays,
      hireDate: req.body.hireDate,
      employeeStatus: "active",
      leaveDate: req.body.leaveDate,
      reasonForLeaving: req.body.reasonForLeaving,
      exitInterviewNotes: req.body.exitInterviewNotes,
      workExperience: req.body.workExperience,
      childrenCount: req.body.childrenCount,
      dependentsCount: req.body.dependentsCount,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactPhoneNumber: req.body.emergencyContactPhoneNumber,
      departmentManager: req.body.departmentManager,
    });

    //create username -> check username
    const wordsArrayFirstName = req.body.firstName.split("-");
    const wordsArrayLastName = req.body.lastName.split("-");
    let newUsername = (
      wordsArrayFirstName[0] +
      "." +
      wordsArrayLastName[0]
    ).toLowerCase();

    //check username and add the second name if it exists

    const checkUsername = await User.findOne({
      where: { username: newUsername },
    });

    if (checkUsername)
      newUsername = (
        wordsArrayFirstName[0] +
        "." +
        wordsArrayFirstName[1] +
        "." +
        wordsArrayLastName[0]
      ).toLowerCase();

    const companyEmail = newUsername + "@company.com";

    //create qr code
    const qrCode = new QRCode({
      content: newEmployee.employeeId,
      container: "svg",
      join: true,
    }).svg();

    //update work email field with username@companyemail.com
    await Employee.update(
      { workEmail: companyEmail, qrCode: qrCode },
      {
        where: { employeeId: newEmployee.employeeId },
      }
    );

    //create random password
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    //check userType
    let newUserType = "";
    if (req.body.department === "HR") newUserType = "hr";
    else newUserType = "employee";

    //create password bcrypt
    const newPassword = await bcrypt.hash(password, 12);

    //create user
    const newUser = await User.create({
      username: newUsername,
      password: newPassword,
      userType: newUserType,
      accountStatus: 1,
      employeeId: newEmployee.employeeId,
      updatedPassword: 0,
    });

    //return username and password to front
    res.status(200).json({ username: newUsername, password: password });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.patchEditEmployee = async (req, res, next) => {
  const { employeeId } = req.params;
  const updatedFields = req.body; 
  try {
    const [updatedRowsCount] = await Employee.update(updatedFields, {
      where: { employeeId },
    });
    const updatedEmployee = await Employee.findOne({ where: { employeeId } });
    if (updatedRowsCount > 0 && updatedEmployee) {
      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        employee: updatedEmployee,
      });
    } else {
      res.status(404).json({
        error: "No changes made or employee not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.patchEditRequestStatus = async (req, res, next) => {
  const { requestId } = req.params;
  const updatedFields = req.body;
  try {
    const [updatedRowsCount] = await Request.update(updatedFields, {
      where: { requestId },
    });
    const updatedRequest = await Request.findOne({ where: { requestId } });

    if (updatedRowsCount > 0 && updatedRequest) {
      res.status(200).json({
        success: true,
        message: "Request updated successfully",
        request: updatedRequest,
      });
    } else {
      res.status(404).json({
        error: "No changes made or request not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEmployeeCertificatesNew = async (req, res, next) => {
  try {
    const hrEmployeeId = req.employeeId;
    const hrEmployee = await Employee.findOne({
      where: { employeeId: hrEmployeeId },
      attributes: ["lastName", "firstName"],
    });
    const hrEmployeeName = hrEmployee.lastName + " " + hrEmployee.firstName;

    const doc = new PDFDocument();
    console.log(__dirname);
    const filePath = path.join(__dirname, "generated.pdf");
    const fileStream = fs.createWriteStream(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="generated.pdf"');
    doc.pipe(res);

    doc.pipe(fileStream);

    doc.font("Helvetica-Bold").fontSize(16).text("HR APP", 65, 50);
    doc.font("Helvetica-Bold").fontSize(16).text("Licenta 2024", 50, 70);


    const lowerRightText = `Semnatura,\n${hrEmployeeName}`;
    const lowerRightTextWidth = doc.widthOfString(lowerRightText);
    const lowerRightTextHeight = doc.heightOfString(lowerRightText, {
      width: lowerRightTextWidth,
    });

    const lowerRightX = doc.page.width - 50 - lowerRightTextWidth;
    const lowerRightY = doc.page.height - 200;

    doc
      .fontSize(12)
      .text(lowerRightText, lowerRightX, lowerRightY, { align: "right" });


    doc.end();

    fileStream.on("finish", () => {});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHREmployeeName = async (req, res, next) => {
  try {
    const hrEmployeeId = req.employeeId;
    const hrEmployee = await Employee.findOne({
      where: { employeeId: hrEmployeeId },
      attributes: ["lastName", "firstName"],
    });
    const hrEmployeeName = hrEmployee.lastName + " " + hrEmployee.firstName;
    res.status(200).json(hrEmployeeName);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEmployeeByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const employee = await User.findOne({
      where: { username: username },
      include: Employee,
    });
    res.status(200).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequestById = async (req, res, next) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findOne({
      where: { requestId: requestId },
      include: [
        {
          model: Employee,
          attributes: ["lastName", "firstName", "department"],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });
    res.status(200).json(request);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEmployeeName = async (req, res, next) => {
  try {
    const employeeId = req.query.employeeId;
    console.log(employeeId);
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

exports.getLeavesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const employee = await User.findOne({
      where: { username: username },
    });
    const employeeId = employee.employeeId;
    const leaves = await Leave.findAll({
      where: { employeeId: employeeId, status: "solved" },
    });
    res.status(200).json(leaves);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAttendancesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const employee = await User.findOne({
      where: { username: username },
    });
    const employeeId = employee.employeeId;
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
