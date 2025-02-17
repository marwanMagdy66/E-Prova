import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import AuthRouter from "./src/modules/Auth/Auth.routes.js";
import CategoryRouter from "./src/modules/Category/Category.router.js";
dotenv.config();
const app = express();
app.use(express.json());

//connect DB
await connectDB();

//routes
app.use("/auth", AuthRouter);
app.use("/category", CategoryRouter);
///Page not found handler
app.all("*", (req, res, next) => {
  return next(new Error(`Route ${req.originalUrl} not found in this server`));
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
