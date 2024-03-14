const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Employee = sequelize.define("Employee", {
  employeeId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  lastName: Sequelize.STRING,
  firstName: Sequelize.STRING,
  CNP: Sequelize.BIGINT(13),
  idCardInfo: Sequelize.STRING,
  dateOfBirth: Sequelize.DATEONLY,
  languages: Sequelize.STRING,
  workEmail: Sequelize.STRING,
  workPhoneNumber: Sequelize.BIGINT(10),
  personalEmail: Sequelize.STRING,
  personalPhoneNumber: Sequelize.BIGINT,
  country: Sequelize.STRING,
  city: Sequelize.STRING,
  address: Sequelize.STRING,
  department: {
    type: Sequelize.ENUM(
      "HR",
      "IT",
      "Finance",
      "Marketing",
      "SSM",
      "Legal",
      "Management",
      "PR"
    ),
  },
  jobTitle: Sequelize.STRING,
  educationBackground: {
    type: Sequelize.ENUM("liceu", "licenta", "master", "doctorat"),
  },
  trainingBackground: Sequelize.STRING,
  certifications: Sequelize.STRING,
  contractPeriod: { type: Sequelize.ENUM("determinata", "nedeterminata") },
  expectedLeaveDate: Sequelize.DATEONLY,
  hoursPerWeek: Sequelize.INTEGER,
  salary: Sequelize.INTEGER,
  totalVacationDays: Sequelize.INTEGER,
  hireDate: Sequelize.DATEONLY,
  employeeStatus: {
    type: Sequelize.ENUM("active", "suspended", "inactive", "maternity"),
  },
  leaveDate: Sequelize.DATEONLY,
  reasonForLeaving: {
    type: Sequelize.ENUM("ended", "fired", "retired", "resigned"),
  },
  exitInterviewNotes: Sequelize.STRING,
  workExperience: Sequelize.FLOAT,
  childrenCount: Sequelize.INTEGER,
  dependentsCount: Sequelize.INTEGER,
  emergencyContactName: Sequelize.STRING,
  emergencyContactPhoneNumber: Sequelize.BIGINT,
  departmentManager: Sequelize.BOOLEAN,
  qrCode: Sequelize.TEXT,
});

module.exports = Employee;
