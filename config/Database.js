import { Sequelize } from "sequelize";

const db = new Sequelize("pharmacy_app", "root", "password", {
  host: "127.0.0.1",
  // port: "3000",
  port: "3306",
  dialect: "mysql",
  // dialectOptions: {
  //   socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock", //  Specify the socket file path
  // },
});

export default db;
