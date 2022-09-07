import database from "../config/DB.js";
import { createToken } from "../helper/createToken.js";
import jwt_decode from "jwt-decode";
import Crypto from "crypto";
import { transporter } from "../helper/nodemailer.js";
import hbs from "nodemailer-express-handlebars";
import { handlebarOptions } from "../helper/handlebars.js";
const db = database.promise();

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    // password = Crypto.createHmac("sha1", "hash123")
    //   .update(password)
    //   .digest("hex");
    const scriptQuery = `select * from admin where email = ?;`;

    const [result] = await db.execute(scriptQuery, [email]);

    if (result.length) {
      if (result[0].password === password) {
        let date = Date.now();
        const { id, email } = result[0];

        const token = createToken({ id, email, date });

        res.status(200).send({ adminData: result[0], token });
      } else {
        res.status(200).send("Password didn't match!");
      }
    } else {
      res.status(200).send("Email not found!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const keepLogin = async (req, res) => {
  try {
    const scriptQuery = `select * from admin where email = ?;`;
    const decoded = jwt_decode(req.body.token);

    const [result] = await db.execute(scriptQuery, [decoded.email]);
    let date = Date.now();
    const { id, email } = result[0];

    const token = createToken({ id, email, date });

    res.status(200).send({ adminData: result[0], token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$&ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let rawPassword = "";
    // Generate Password
    for (var i = 0; i <= 5; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      rawPassword += chars.substring(randomNumber, randomNumber + 1);
    }
    let password = rawPassword;
    // Hashing Password
    password = Crypto.createHmac("sha1", "hash123")
      .update(password)
      .digest("hex");

    let checkEmailQuery = "select * from admin where email = ?;";
    const insertQuery =
      "insert into admin(first_name, email, password, is_verified, role) values(?,?,?,0,'Admin');";

    // Check unique email
    const [resultEmail] = await db.execute(checkEmailQuery, [email]);
    if (resultEmail.length) return res.status(200).send("email");

    // Insert new admin
    const [result] = await db.execute(insertQuery, [name, email, password]);
    if (result.insertId) {
      let getQuery = "select * from admin where id = ?;";
      const [resultData] = await db.execute(getQuery, [result.insertId]);
      const { id, email } = resultData[0];
      const token = createToken({ id, email });
      const mail = {
        from: `RAMU <kuperhubid@gmail.com>`,
        to: `${email}`,
        subject: `RAMU Admin Account Verification`,
        template: "adminVerification",
        context: { name, token, rawPassword },
      };

      transporter.use("compile", hbs(handlebarOptions));
      transporter.sendMail(mail);
      res.status(200).send("success");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const verification = async (req, res) => {
  try {
    console.log(req.user);
    let updateQuery = "update admin set is_verified = 1 where id = ?;";
    await db.execute(updateQuery, [req.user.id]);
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
