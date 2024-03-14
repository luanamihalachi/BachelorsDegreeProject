const express = require("express");

const adminController = require("../controllers/admin");

const authenticationMiddleware = require("../middleware/is-authenticated");
const authorizationMiddleware = require("../middleware/is-authorized");

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizationMiddleware(["admin"]));

router.get(
  "/employees-without-login",
  adminController.getEmployeesWithoutLogin
);

router.post("/user-login/create", adminController.postUserCreateLogin);

module.exports = router;
