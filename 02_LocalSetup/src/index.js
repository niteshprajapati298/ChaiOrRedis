import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';
const port = process.env.PORT || 3000;
const app = express();
const redis = new Redis(process.env.LOCAL_REDIS || 'redis://localhost:6379');
app.get('/redis',async (req,res) => {
    const reply = await redis.ping();
    return res.json({message:`Redis Replied with"+${reply}`});
})

app.listen(port,()=>{
    console.log(`Server is Running on Port ${port}`)
})