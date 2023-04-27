const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/userModel");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    email,
  });

  if (user && user._id) {
    // user was found
    // check the password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    // console.log("LOG2", isValidPassword);
    if (isValidPassword) {
      // log him in
      const jwtSignaturePayload = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      // generate a JWT token
      const authToken = jwt.sign(jwtSignaturePayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const response = {
        ...jwtSignaturePayload,
        authToken,
      };

      //   res.cookie("COOKIETOKEN", authToken, {
      //     expiry: Date.now() + 3600 * 1000,
      //     httpOnly: true,
      //     path: "/",
      //   });
      res.send(response);
    } else {
      res.status(401).send("Incorrect password");
    }
  } else {
    res.status(404).send({
      status: "Failed",
      reason: "Incorrect credentials or the user doesn't exist",
    });
  }
};

const logout = async (req, res) => {
  // res.clearCookie("COOKIETOKEN");
  // res.send({ success: true });
};

const signup = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.json({
        message: "User already exists!",
      });
    } else {
      // console.log("PASSWORD_PLAIN", password);
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
      });
      user.save();
      // .json({ message: "user registered succesfully" })
      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          authToken: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
    // return login(req, res)
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(409).send({
        status: "failed",
        reason: "User already exists",
      });
    } else {
      res.status(500).send({
        status: "Failed",
        reason: err.toString(),
      });
    }
  }
};

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = { login, signup, logout };
