const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
// MIDDLEWARE
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyToken");
// ROUTES
const authRoute = require("./routes/auth");
const employeeRoute = require("./routes/employees");
const registerRoute = require("./routes/register");
const refreshRoute = require("./routes/refresh");
const logoutRoute = require("./routes/logout");
require("dotenv").config();

// MIDDLEWARE
// for credentials
app.use(credentials);
// for CORS cross-origin-resource-sharing
app.use(cors(corsOptions));
//  for url-encoded-data
app.use(bodyParser.urlencoded({ extended: false }));
//  for json
app.use(express.json());
//  for cookies
app.use(cookieParser());

// ROUTES
app.use("/auth", authRoute);
app.use("/register", registerRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);

app.use(verifyJWT);
app.use("/employees", employeeRoute);

// ERROR
app.use("*", (req, res) => res.status(403).json("Page not found!"));

app.listen(process.env.PORT, () =>
  console.log(`API up and running on port: ${process.env.PORT}`)
);
