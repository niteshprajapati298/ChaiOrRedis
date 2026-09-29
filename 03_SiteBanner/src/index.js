import express from 'express';
import Redis from 'ioredis'
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const redis = new Redis(process.env.REDIS_PORT ||'redis://localhost:6379');

app.use('/ping',async (req,res) => {
     const reply = await redis.ping();
     return res.json({message:`Redis Replied With ${reply}`});
});

const BANNER_KEY = 'app:banner';

app.post('/banner',async (req,res) => {
    await redis.set(BANNER_KEY,req.body.message || "Welcome to our redis series");
    res.json({success:true});
})
app.get('/banner',async(req,res)=>{
    const message = await redis.get(BANNER_KEY);
    res.json({message});
})
app.delete('/banner',async (req,res) => {
    const message = await redis.del(BANNER_KEY);
    res.json({success:true});
})
app.get('/banner/exists',async (req,res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({exists:exists});
})
app.listen(port,()=>{
   console.log(`Server is Successfully Listening on PORT ${port}`);
});