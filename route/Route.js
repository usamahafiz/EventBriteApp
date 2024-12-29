const express = require("express");
const routers = express.Router();
const User = require("../models/user");

const { register, login } = require("../controller/authController");

// Routes for authentication
routers.post("/register", register);
routers.post("/login", login);




module.exports = routers;