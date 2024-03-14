const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee");

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({
    where: { username: username },
    include: [
      {
        model: Employee,
        attributes: ["departmentManager"],
      },
    ],
  })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found!");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqualPass) => {
      if (!isEqualPass) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          userId: loadedUser.userId,
          username: loadedUser.username,
          userType: loadedUser.userType,
          employeeId: loadedUser.employeeId,
          departmentManager: loadedUser.Employee.departmentManager,
        },
        "licenta-secret",
        { expiresIn: "30d" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser.userId,
        userType: loadedUser.userType,
        employeeId: loadedUser.employeeId,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logout = (req, res, next) => {
  try {
    req.session.destroy();
    res.status(200).json("Logout succesful!");
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
