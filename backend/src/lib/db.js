import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL
    if (!mongoUrl) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(mongoUrl);
    console.log("MONGO DB connected: ", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  process.exit(1);
//   1 means that the process exited with an error code, indicating that something went wrong during the connection attempt. 
//  0 means that the process exited successfully without any errors.
}
};
export default connectDB;