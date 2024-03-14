const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const hrRoutes = require("./routes/hr");
const employeeRoutes = require("./routes/employee");
const sequelize = require("./util/database");
const noLoginRoutes = require("./routes/noLoginRoutes");

const cors = require("cors");

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  database: "licenta",
  password: "admin123",
};
const app = express();
const sessionStore = new MySQLStore(options);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
app.use(cors());

app.use(
  session({
    secret: "licenta-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use("/api/no-login", noLoginRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/employee", employeeRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(8000, () => console.log("Server started"));
  })
  .catch((err) => {
    console.log(err);
  });
