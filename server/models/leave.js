const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Employee = require("./employee");
const Leave = sequelize.define("Leave", {
  leaveId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  leaveName: Sequelize.STRING,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
  description: Sequelize.STRING,
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
  reason: {
    type: Sequelize.ENUM("rest", "maternity", "medical", "paternity", "unpaid"),
  },
  status: {
    type: Sequelize.ENUM("pending", "solved", "denied"),
    defaultValue: "pending",
  },
});

Leave.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(Leave, { foreignKey: "employeeId" });

module.exports = Leave;
