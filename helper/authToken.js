import jwt from "jsonwebtoken";

export const AuthToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, decode) => {
    if (err) {
      return res.status(401).send("User not authenticated!");
    }
    req.user = decode;
    next();
  });
};
