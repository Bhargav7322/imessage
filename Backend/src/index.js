import express from "express";
import "dotenv/config";
import connectDB from "./lib/db.js"
import cors from "cors";
import User from "./models/user.model.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();
import dns from "node:dns";

// set custom DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT 
const FRONTEND_URL = process.env.FRONTEND_URL

// console.log("PORT =", process.env.PORT);
// console.log("MONGODB_URL =", process.env.MONGODB_URL);

// app.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
// });

app.use(express.json());
app.use(cors(origin=FRONTEND_URL,credentials=true));
app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
  const {message,image,video} = req.body
  res.status(200).json({message:"Server is healthy"})
})

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + PORT);
});




