import express from "express";
import "dotenv/config";
import connectDB from "./lib/db.js"
import User from "./models/user.model.js";
const app = express();
import dns from "node:dns";

// set custom DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const PORT = process.env.PORT 
console.log("PORT =", process.env.PORT);
console.log("MONGODB_URL =", process.env.MONGODB_URL);

// app.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
// });

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + PORT);
}
)