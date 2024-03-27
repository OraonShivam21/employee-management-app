const express = require("express");
const connection = require("./connection");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

// Allow all origins for CORS
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Employee Management API!" });
});

// adding routes for employees and user
app.use("/", userRoutes);

app.use("/", employeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to mongodb");
    console.log("listening on port", PORT);
  } catch (error) {
    console.log("error in connecting to db", error);
  }
});
