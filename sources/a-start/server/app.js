// if not production use dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Assume this is utils/jwt.js
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
// End of Assumption

// Assume this is utils/bcrypt.js
const bcrypt = require("bcryptjs");

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
// End of Assumption

// Assume this is middlewares/authenticate.js
// const { Credential } = require("../models");
const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(req.headers);

    if (!authorization) {
      throw new Error("NOT_AUTHENTICATED");
    }

    const bearerToken = authorization.split(" ")[1];
    const decoded = verifyToken(bearerToken);

    const foundUser = await Credential.findByPk(decoded.id);

    if (!foundUser) {
      throw new Error("NOT_AUTHENTICATED");
    }

    req.user = {
      id: foundUser.id,
      email: foundUser.email,
    };

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// End of Assumption

// Main file start here
const cors = require("cors");
const express = require("express");
const { Credential } = require("./models");

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Pong !",
  });
});

app.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { password: newPassword, ...newUser } = (
      await Credential.create({
        email,
        password,
      })
    ).dataValues;

    res.status(201).json({
      statusCode: 201,
      message: "User created",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await Credential.findOne({
      where: {
        email,
      },
    });

    if (!foundUser || !comparePassword(password, foundUser.password)) {
      throw new Error("INVALID_EMAIL_OR_PASSWORD");
    }

    const payload = {
      id: foundUser.id,
    };

    const token = generateToken(payload);

    res.status(200).json({
      statusCode: 200,
      message: "Login success",
      data: {
        access_token: token,
      },
    });
  } catch (err) {
    next(err);
  }
});

app.get("/private", authentication, (req, res, next) => {
  res.status(200).json({
    statusCode: 200,
    message: "Data from private route !",
    data: req.user,
  });
});

// error handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    message = err.errors[0].message;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "You are not authenticated";
  } else if (err.name === "INVALID_EMAIL_OR_PASSWORD") {
    statusCode = 400;
    message = "Invalid email or password";
  } else if (err.name === "NOT_AUTHENTICATED") {
    statusCode = 401;
    message = "You are not authenticated";
  }

  res.status(statusCode).json({
    statusCode,
    error: {
      message,
    },
  });
});

// listener
app.listen(port, () => {
  console.log(`Apps is running on port ${port}`);
});
