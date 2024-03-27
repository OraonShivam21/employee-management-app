// Server link to access API routes
const link = "https://employee-management-app-tqta.onrender.com";

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", (e) => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  // console.log(email, password);
  // fetching post request to get access token to be stored in local storage
  fetch(`${link}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      localStorage.setItem("token", JSON.stringify(data.access_token));
      window.location.href = "/dashboard.html";
    })
    .catch((error) => alert(error.error));
});

signupBtn.addEventListener("click", (e) => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;

  if (password === confirmPassword) {
    // fetching post request to signup user
    fetch(`${link}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        alert("You've been successfully registered! Now please login.");
        window.location.href = "/client/index.html";
      })
      .catch((error) => alert(error.error));
  } else {
    alert("Passwords doesn't match, please enter passwords correctly");
  }
});
