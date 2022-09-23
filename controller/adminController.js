import { authToken, createToken } from "../helper/createToken.js";
import Crypto from "crypto";
import Admins from "../models/AdminModel.js";
import { generate, hash } from "../helper/passwordManager.js";
import { transporter } from "../helper/nodemailer.js";
import hbs from "nodemailer-express-handlebars";
import { handlebarOptions } from "../helper/handlebars.js";
import { Op } from "sequelize";

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const admins = await Admins.findOne({ where: { email } });
    if (!admins) {
      return res.status(200).send("Account not found!");
    }

    const date = Date.now();
    const adminData = admins.dataValues;
    const token = createToken({ id: adminData.id, email, date }, "30m");

    if (adminData.role === "Admin") {
      password = Crypto.createHmac("sha1", "hash123")
        .update(password)
        .digest("hex");
      if (adminData.password === password) {
        delete adminData.password;
        return res.status(200).send({ adminData, token });
      }
      return res.status(200).send("Password didn't match!");
    }

    if (adminData.password === password) {
      delete adminData.password;
      return res.status(200).send({ adminData, token });
    }
    res.status(200).send("Password didn't match");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const keepLogin = async (req, res) => {
  try {
    const auth = authToken(req.body.token);

    if (!auth) {
      return res.status(200).send("0");
    }

    const { id, email } = auth;
    const admins = await Admins.findOne({ where: { email } });
    const adminData = admins.dataValues;
    delete adminData.password;

    const date = Date.now();
    const token = createToken({ id, email, date }, "30m");
    res.status(200).send({ adminData, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const generated = generate(8);
    let password = hash(generated);

    const checkEmail = await Admins.findOne({ where: { email } });
    if (checkEmail) return res.status(200).send("email");

    const result = await Admins.create({
      first_name,
      last_name,
      email,
      password,
    });
    if (result) {
      const token = createToken({ id: result.id, email }, "1h");
      const mail = {
        from: `RAMU <kuperhubid@gmail.com>`,
        to: `${email}`,
        subject: `RAMU Admin Account Verification`,
        template: "adminVerification",
        context: { first_name, token, generated },
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
    const auth = authToken(req.token);
    if (auth) {
      await Admins.update({ is_verified: true }, { where: { id: auth.id } });
      return res.status(200).send(true);
    }
    res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const sendResetLink = async (req, res) => {
  try {
    const result = await Admins.findOne({ where: { email: req.body.email } });
    if (result) {
      const { id, first_name, email } = result.dataValues;
      const token = createToken({ id, email }, "1h");
      const mail = {
        from: `RAMU <kuperhubid@gmail.com>`,
        to: `${email}`,
        subject: `RAMU Account Reset Password`,
        template: "adminResetPassword",
        context: { first_name, token },
      };

      transporter.use("compile", hbs(handlebarOptions));
      transporter.sendMail(mail);
      return res.status(200).send(true);
    }
    res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const authResetToken = async (req, res) => {
  try {
    const auth = authToken(req.token);
    if (auth) {
      return res.status(200).send(true);
    }
    res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(200).send(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { password, token } = req.body;
    password = await hash(password);
    const auth = authToken(token);
    if (auth) {
      await Admins.update({ password }, { where: { id: auth.id } });
      return res.status(200).send(true);
    }
    res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getAdmins = async (req, res) => {
  try {
    const { page, perPage, nameOrMail, asc } = req.body;
    console.log(req.body);
    const { count } = await Admins.findAndCountAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${nameOrMail}%` } },
          { email: { [Op.like]: `%${nameOrMail}%` } },
        ],
      },
    });
    const result = await Admins.findAll({
      order: asc ? [["first_name"]] : [["first_name", "desc"]],
      limit: perPage,
      offset: page * perPage - perPage,
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${nameOrMail}%` } },
          { email: { [Op.like]: `%${nameOrMail}%` } },
        ],
      },
    });
    res.status(200).send({ admins: result, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
