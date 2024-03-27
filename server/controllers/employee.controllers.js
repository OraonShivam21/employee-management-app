const Employee = require("../models/employee.models");

const getEmployees = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, search, department, sort } = req.query;
    const skip = (page - 1) * pageSize;

    let query = {};
    if (search) {
      query.firstName = { $regex: new RegExp(search, `i`) };
    }
    if (department) {
      query.department = department;
    }

    const sortOptions = {};
    if (sort) {
      sortOptions.salary = parseInt(sort);
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(pageSize)),
      Employee.countDocuments(query), // Count total number of documents
    ]);

    if (employees.length == 0) throw "No employees record to show";

    const totalPages = Math.ceil(total / pageSize);
    res.status(200).json({ employees, totalPages, currentPage: page });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const addNewEmployee = async (req, res) => {
  try {
    const payload = req.body;
    const employee = new Employee(payload);
    await employee.save();
    res.status(201).json({ message: "Added new employee data" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const payload = req.body;
    await Employee.findByIdAndUpdate(employeeId, payload);
    res.status(200).json({ message: "Employee data udpated" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    await Employee.findByIdAndDelete(employeeId);
    res.status(200).json({ message: "Employee data deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  getEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
};
