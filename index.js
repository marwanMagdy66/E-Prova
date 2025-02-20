import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import AuthRouter from "./src/modules/Auth/Auth.routes.js";
import CategoryRouter from "./src/modules/Category/Category.router.js";
import productRouter from "./src/modules/Product/Product.routes.js";
import brandRouter from "./src/modules/Brand/Brand.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());

app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:5173", // لدعم Vite
  process.env.CLIENT_URL || "https://e-prova.vercel.app"
];

app.use((req, res, next) => {

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// إضافة `cors()` كـ Middleware احتياطي
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

//connect DB
await connectDB();

//routes
app.use("/auth", AuthRouter);
app.use("/Category", CategoryRouter);

app.use('/Brand',brandRouter)

app.use("/Product", productRouter);
///Page not found handler
app.all("*", (req, res, next) => {
  return next(new Error(`Route  not found in this server`));
});

//global error handler
app.use((err, req, res, next) => {
  const statusCode = err.cause || 500;
  res
    .status(statusCode)
    .json({ success: false, message: err.message, stack: err.stack });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
