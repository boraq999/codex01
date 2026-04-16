const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const env = require("../config/env");
const AppError = require("../utils/appError");

const login = async ({ username, password }) => {
  const user = await userModel.findByUsername(username);

  if (!user || user.status !== "active") {
    throw new AppError("Invalid credentials.", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new AppError("Invalid credentials.", 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      employee_id: user.employee_id,
      username: user.username,
      role: user.role,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      employee_id: user.employee_id,
      employee_name: user.employee_name,
    },
  };
};

module.exports = {
  login,
};

