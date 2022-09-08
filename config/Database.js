import { Sequelize } from "sequelize";

const db = new Sequelize("pharmacy_app", "root", "password", {
  host: "127.0.0.1",
  // host: "localhost",
  port: "3000",
  // port: "3307",
  dialect: "mysql",
  dialectOptions: {
    socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock", //  Specify the socket file path
  },
});

export default db;
