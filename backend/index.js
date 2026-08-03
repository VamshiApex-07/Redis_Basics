import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./lib/db.js"
import User from "./models/user.model.js"
import Redis from "ioredis"
const port=process.env.PORT || 5000
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app=express()
app.use(express.json());

const redis=new Redis(process.env.REDIS_URL)
app.get("/",(req,res)=>{
    return res.status(200).json({message:"hello from redis"})
})

app.get("/get-with-redis", async (req, res) => {
    try {
        const cached = await redis.get("user:all");
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const users = await User.find({});
        await redis.set("user:all", JSON.stringify(users));
        return res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});       
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