const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const loginSchema = joi.object({
  email: joi.string().required().email().min(6),
  password: joi.string().required().min(8),
});

router.post("/", async (req, res) => {
  try {
    // joi validation
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // check if user exist
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Wrong Password or Email");

    // check password
    const compareResult = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!compareResult) return res.status(400).send("Wrong Password or Email");

    // create token
    const genToken = jwt.sign(
      {
        _id: user._id,
        biz: user.biz,
      },
      process.env.secretKey
    );
    res.status(200).send({ token: genToken });
  } catch (error) {
    res.status(400).send("Error in Login" + error);
  }
});

module.exports = router;
