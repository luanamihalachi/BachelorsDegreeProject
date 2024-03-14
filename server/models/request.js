const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Employee = require("./employee");

const Request = sequelize.define("Request", {
  requestId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  requestName: Sequelize.STRING,
  requestStatus: {
    type: Sequelize.ENUM("pending", "solved", "denied"),
    defaultValue: "pending",
  },
  description: Sequelize.STRING,
});

Request.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(Request, { foreignKey: "employeeId" });

module.exports = Request;
// Request.create({
//   request_name: "pending test",
//   requestStatus: "pending",
//   description: "pending request",
// });
