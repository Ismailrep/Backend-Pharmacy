import cors from "cors";
import session from "express-session";
import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
dotenv.config();

const app = express();

(async () => {
  await db.sync();
})();

// middleware
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);

// running backend
app.listen(process.env.APP_PORT, () => {
  console.log("Server is up and running...");
});
