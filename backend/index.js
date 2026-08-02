import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./lib/db.js"
import User from "./models/user.model.js"
const port=process.env.PORT || 5000
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app=express()
app.use(express.json());
app.get("/",(req,res)=>{
    return res.status(200).json({message:"hello from redis"})
})
app.post("/create",async (req,res)=>{
    const {name,email,password}=req.body
    const user=await User.create({
        name,email,password
    })

    return res.json(user)
})
//78ms
app.get("/get",async (req,res)=>{

    const user=await User.find({})

    return res.json(user)
})
app.listen(port,()=>{
    connectDB();
    console.log(`server started ${port}`)
})