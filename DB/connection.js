import mongoose from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DB connected successfully!"))
    .catch(() => console.log('failed to connect DB!'));
};
