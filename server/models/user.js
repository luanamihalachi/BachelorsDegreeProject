const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const bcrypt = require("bcrypt");
const Employee = require("./employee");
const User = sequelize.define("User", {
  userId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  userType: { type: Sequelize.ENUM("hr", "employee") },
  accountStatus: Sequelize.BOOLEAN,
  updatedPassword: Sequelize.BOOLEAN,
});

User.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasOne(User, { foreignKey: "employeeId" });

module.exports = User;
