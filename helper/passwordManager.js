import Crypto from "crypto";

export const generate = (length) => {
  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$&ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  // Generate Password
  for (let i = 0; i < length; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
};

export const hash = (password) => {
  try {
    return Crypto.createHmac("sha1", "hash123").update(password).digest("hex");
  } catch (error) {
    console.log(error);
    return false;
  }
};
