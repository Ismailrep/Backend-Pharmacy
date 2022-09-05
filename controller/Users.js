import User from "../models/UserModel.js";
import bcrypt, { hash } from "bcrypt";
import { transporter } from "../helper/nodemailer.js";
import hbs from "nodemailer-express-handlebars";
import { handlebarOptions } from "../helper/handlebars.js";
import { createToken } from "../helper/createToken.js";

// export const getUser = async (req, res) => {
//   try {
//     const response = await User.findAll({
//       attributes: [
//         "uuid",
//         "first_name",
//         "last_name",
//         "email",
//         "phone",
//         "is_verified",
//       ],
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const getUserById = async (req, res) => {
//   try {
//     const response = await User.findOne({
//       attributes: [
//         "uuid",
//         "first_name",
//         "last_name",
//         "email",
//         "phone",
//         "is_verified",
//       ],
//       where: {
//         uuid: req.params.id,
//       },
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;
  // const newUser = new User(req.body);

  // if (password !== confPassword) {
  //   return res.status(400).json({ msg: "Password didn't match!" });
  // }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  try {
    const token = createToken({ email });

    const alreadyExistUser = await User.findOne({ where: { email } }).catch(
      (err) => {
        console.log("Error", err);
      }
    );

    if (alreadyExistUser) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    transporter.use("compile", hbs(handlebarOptions));

    const response = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPass,
      phone: phone,
      is_verified: false,
    });

    console.log(response.uuid);
    process.exit(3);

    let mail = {
      from: "kuperhubid@gmail.com",
      // bisa diganti menjadi email user saat input, tetapi untuk contoh jadi email ini:
      to: "antarisaryan@gmail.com",
      subject: "RAMU Account Verification",
      template: "email",
      context: {
        user: first_name,
        token: token,
        // uuid: uuid,
      },
    };

    transporter.sendMail(mail, (errMail, resMail) => {
      if (errMail) {
        console.log(errMail);
      }
    });

    res.status(201).json({ msg: "Account Registered!", token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const uuid = await User.findOne({
      attributes: ["uuid"],
      where: {
        uuid: req.params.id,
      },
    });

    if (uuid) {
      await User.update(
        {
          is_verified: true,
        },
        {
          // where: { id: user.id },
          where: { uuid: req.params.id },
        }
      );
    }
    res.status(201).json({ msg: "User Verified", uuid });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// export const updateUser = async (req, res) => {
//   const user = await User.findOne({
//     where: {
//       uuid: req.params.id,
//     },
//   });
//   if (!user) return res.status(404).json({ msg: "User Not Found" });
//   const { first_name, last_name, email, password, confPassword, phone } =
//     req.body;
//   let hashedPass;
//   if (password === "" || password === null) {
//     hashedPass = user.password;
//   } else {
//     const salt = await bcrypt.genSalt(10);
//     hashedPass = await bcrypt.hash(password, salt);
//   }

//   if (password !== confPassword) {
//     return res.status(400).json({ msg: "Password didn't match!" });
//   }
//   try {
//     await User.update(
//       {
//         first_name: first_name,
//         last_name: last_name,
//         email: email,
//         password: hashedPass,
//         phone: phone,
//       },
//       {
//         where: { id: user.id },
//       }
//     );
//     res.status(201).json({ msg: "User Updated" });
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };

// export const deleteUser = async (req, res) => {
//   const user = await User.findOne({
//     where: {
//       uuid: req.params.id,
//     },
//   });
//   if (!user) return res.status(404).json({ msg: "User Not Found" });
//   try {
//     await User.destroy({
//       where: { id: user.id },
//     });
//     res.status(201).json({ msg: "User Deleted" });
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//   }
// };
