const server_uri = "https://employee-management-app-tqta.onrender.com";
const token = JSON.parse(localStorage.getItem("token"));

if (!token) window.location.href = "/client/index.html";

const editFirstName = document.getElementById("editFirstName");
const editLastName = document.getElementById("editLastName");
const editEmail = document.getElementById("editEmail");
const editSalary = document.getElementById("editSalary");
const editDepartment = document.getElementById("editDepartment");
const editJoinDate = document.getElementById("editJoinDate");
const editEmployeeBtn = document.getElementById("editEmployeeBtn");

document.getElementById("addEmployee").addEventListener("click", (e) => {
  document.getElementById("addFields").style.display = "block";
});

document.getElementById("addEmployeeBtn").addEventListener("click", (e) => {
  const firstName = document.getElementById("addFirstName").value;
  const lastName = document.getElementById("addLastName").value;
  const email = document.getElementById("addEmail").value;
  const salary = document.getElementById("addSalary").value;
  const department = document.getElementById("addDepartment").value;
  const dateOfJoin = document.getElementById("addJoinDate").value;
  fetch(`${server_uri}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      salary,
      department,
      dateOfJoin,
    }),
  })
    .then((res) => res.json)
    .then((data) => {
      window.location.href = "/client/dashboard.html";
    });
});

let currentPage = 1;
let totalPages = 0;

window.addEventListener("load", (e) => {
  fetchEmployeeData();
});

function fetchEmployeeData() {
  fetch(`${server_uri}/employees?page=${currentPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      currentPage = data.currentPage;
      totalPages = data.totalPages;
      renderEmployeeData(data.employees);
      renderPaginationButton();
    });
}

function renderEmployeeData(employees) {
  const employeeBody = document.getElementById("employeeBody");
  employeeBody.innerHTML = "";
  let id = currentPage * 5 - 4;
  employees.forEach((employee) => {
    employeeBody.appendChild(createEmployeeTableRow(id, employee));
    id++;
  });
}

function createEmployeeTableRow(id, employee) {
  const tr = document.createElement("tr");

  const no = document.createElement("td");
  no.innerText = id;
  tr.appendChild(no);

  const firstName = document.createElement("td");
  firstName.innerHTML = employee.firstName;
  tr.appendChild(firstName);

  const lastName = document.createElement("td");
  lastName.innerHTML = employee.lastName;
  tr.appendChild(lastName);

  const email = document.createElement("td");
  email.innerHTML = employee.email;
  tr.appendChild(email);

  const salary = document.createElement("td");
  salary.innerHTML = `$${employee.salary / 1000},000`;
  tr.appendChild(salary);

  const department = document.createElement("td");
  department.innerHTML = employee.department;
  tr.appendChild(department);

  const joinDate = document.createElement("td");
  joinDate.innerHTML = employee.dateOfJoin.substring(0, 10);
  tr.appendChild(joinDate);

  const editDelete = document.createElement("td");
  const edit = document.createElement("button");
  edit.setAttribute("value", employee._id);
  edit.innerHTML = "Edit";
  editDelete.appendChild(edit);
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("value", employee._id);
  deleteBtn.innerHTML = "Delete";
  editDelete.appendChild(deleteBtn);

  edit.addEventListener("click", (e) => {
    // console.log(e.target.value);
    document.getElementById("editFields").style.display = "block";
    editFirstName.value = employee.firstName;
    editLastName.value = employee.lastName;
    editEmail.value = employee.email;
    editSalary.value = employee.salary;
    editDepartment.value = employee.department;
    editJoinDate.value = employee.dateOfJoin.substring(0, 10);
    editEmployeeBtn.setAttribute("value", employee._id);
  });

  deleteBtn.addEventListener("click", (e) => {
    // console.log(e.target.value);
    deleteEmployeeAndUpdateRender(e.target.value);
  });

  tr.appendChild(editDelete);

  return tr;
}

editEmployeeBtn.addEventListener("click", (e) => {
  editEmployeeAndUpdateRender(e.target.value);
});

function editEmployeeAndUpdateRender(employeeId) {
  const firstName = editFirstName.value;
  const lastName = editLastName.value;
  const email = editEmail.value;
  const salary = editSalary.value;
  const department = editDepartment.value;
  const dateOfJoin = editJoinDate.value;
  fetch(`${server_uri}/employees/${employeeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      salary,
      department,
      dateOfJoin,
    }),
  })
    .then((res) => res.json)
    .then((data) => {
      fetchEmployeeData();
    });
}

function deleteEmployeeAndUpdateRender(employeeId) {
  fetch(`${server_uri}/employees/${employeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => fetchEmployeeData());
}

function renderPaginationButton() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.setAttribute("id", i);
    button.innerHTML = `Page ${i}`;
    pagination.appendChild(button);

    button.addEventListener("click", (e) => {
      currentPage = e.target.id;
      // console.log(currentPage);
      fetchEmployeeData();
    });
  }
}

document.getElementById("logout").addEventListener("click", (e) => {
  localStorage.clear();
  window.location.href = "/client/index.html";
});
