const express = require("express");
const { login, signup } = require("../controllers/user.controllers");

const router = express.Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

module.exports = router;
