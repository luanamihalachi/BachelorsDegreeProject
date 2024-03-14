const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Employee = require("./employee");
const Attendance = sequelize.define("Attendance", {
  attendanceId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  attendanceDate: Sequelize.DATEONLY,
  startTime: Sequelize.TIME,
  endTime: Sequelize.TIME,
  workedTime: Sequelize.INTEGER,
  modeAdded: {
    type: Sequelize.ENUM("qrCode", "manual"),
  },
});

Attendance.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(Attendance, { foreignKey: "employeeId" });

module.exports = Attendance;
