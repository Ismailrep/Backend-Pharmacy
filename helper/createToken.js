import jwt from "jsonwebtoken";

export const createToken = (payload, exp) => {
  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: exp,
  });
};

export const authToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return false;
  }
};
