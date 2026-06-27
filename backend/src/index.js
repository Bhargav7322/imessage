import express from "express";
import "dotenv/config";
import connectDB from "./lib/db.js"
import cors from "cors";
import User from "./models/user.model.js";
import { clerkMiddleware } from '@clerk/express'
import fs from "fs";
import path from "path";  
import job from "./lib/corn.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"


const app = express();
import dns from "node:dns";

// set custom DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT 
const FRONTEND_URL = process.env.FRONTEND_URL

const publicDir = path.join(process.cwd(), 'public');

// console.log("PORT =", process.env.PORT);
// console.log("MONGODB_URL =", process.env.MONGODB_URL);

// app.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
// });

app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }),clerkWebhook);
app.use(express.json());
app.use(cors({origin:FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
  res.status(200).json({message:"Server is healthy"})
})

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(fs.existsSync(publicDir)){
app.use(express.static(publicDir))
app.get("/{*any}",(req,res,next)=>{
  res.sendFile(path.join(publicDir, 'index.html'), (err) => next(err));
})}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on portnumber " + PORT)
  
  if(process.env.NODE_ENV === "production")job.start()
});




