import database from "../config/DB.js";
import { createToken } from "../helper/createToken.js";
import jwt_decode from "jwt-decode";
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
