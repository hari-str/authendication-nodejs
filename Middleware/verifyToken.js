const jwt = require("jsonwebtoken");
const errorHandler = require("./errorHandler");

const verifyToken = (req, res, next) => {
  const token = req.cookies.my_token;
  console.log(token);
  if (!token) return next(errorHandler(401, "Token not found!"));
  jwt.verify(token, process.env.TOKENKEY, (err, user) => {
    if (err) return next(errorHandler(401, "Athendication failed!"));
    req.user = user;
    // console.log(req.user);
    next();
  });
};

module.exports = verifyToken;
