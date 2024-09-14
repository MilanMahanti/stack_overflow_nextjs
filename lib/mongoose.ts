import mongoose from "mongoose";

let isConnected: boolean = false;

export const dbConnect = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URI)
    return console.error("Missing database connection URL");
  if (isConnected) {
    return console.log("Database already connected!");
  }
  try {
    mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: "DevOverFlow",
      })
      .then(() => {
        isConnected = true;
        console.log("DB connection successful 🚀");
      });
  } catch (error) {
    console.log(error);
  }
};
