const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Employee = require("../models/employee");
const User = require("../models/user");

exports.getEmployeesWithoutLogin = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: User,
          where: { employeeId: { [Sequelize.Op.eq]: null } },
          required: false,
        },
      ],
    });
    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function generateRandomPassword() {
  length = 12;
  const buffer = crypto.randomBytes(length);
  const password = buffer.toString("base64").slice(0, length);

  return password;
}

exports.postUserCreateLogin = async (req, res, next) => {
  try {
    const randomPassword = generateRandomPassword();
    const newUser = bcrypt.hash(randomPassword, 12).then((newUser) => {
      User.create({
        username: req.body.username,
        password: newUser,
        userType: req.body.userType,
        accountStatus: 1,
        employeeId: req.body.employeeId,
      });
    });
    res.status(200).json("User added to the database");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
