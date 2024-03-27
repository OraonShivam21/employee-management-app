const express = require("express");
const {
  getEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controllers");
const auth = require("../middlewares/auth.middlewares");

const router = express.Router();

router.route("/employees").get(auth, getEmployees).post(auth, addNewEmployee);

router
  .route("/employees/:id")
  .patch(auth, updateEmployee)
  .delete(auth, deleteEmployee);

module.exports = router;
