const userModel = require("../Model/userModel");
const errorHandler = require("../Middleware/errorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register
const register = async (req, res, next) => {
  try {
    const hashpwd = await bcrypt.hash(req.body.password, 7);
    const userData = new userModel({
      ...req.body,
      password: hashpwd,
    });
    const userEmail = await userModel.findOne({ email: req.body.email });
    if (userEmail) return next(errorHandler(401, "Email is already exits!"));
    const userName = await userModel.findOne({ name: req.body.name });
    if (userName) return next(errorHandler(401, "Name is already exits!"));

    const userSave = await userData.save();
    res.status(200).json({
      Data: userSave,
    });
  } catch (err) {
    next(err);
  }
};

// login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) return next(errorHandler(401, "Email is not valid!"));
    const userPwd = await bcrypt.compare(password, user.password);
    if (!userPwd) return next(errorHandler(401, "Password is not valid!"));

    // Generating token
    const token = jwt.sign({ id: user._id }, process.env.TOKENKEY);
    res
      .cookie("my_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json("Login success");
  } catch (err) {
    next(err);
  }
};

//update
const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({
        msg: "User updated success",
        Data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed!"));
  }
};

//getAll data
const getData = async (req, res, next) => {
  try {
    const getUser = await userModel.find({});

    res.status(200).json({
      Length: getUser.length,
      Data: getUser,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  login,
  updateUser,
  getData,
};
