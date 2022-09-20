import cors from "cors";
import session from "express-session";
import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import adminRouter from "./routes/adminRouter.js";
import productRouter from "./routes/productRouter.js";
import invoiceHeaderRouter from "./routes/invoiceHeaderRouter.js";
import bearerToken from "express-bearer-token";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(bearerToken());
app.use(express.static(path.join(__dirname, "public")));
app.use(UserRoute);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/invoices", invoiceHeaderRouter);

// running backend
app.listen(process.env.APP_PORT, () => {
  console.log("Server is up and running...");
});
