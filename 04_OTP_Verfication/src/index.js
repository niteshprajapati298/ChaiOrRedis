import express from "express";
import Redis from "ioredis";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const redis = new Redis(process.env.REDIS_PORT || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

const BANNER_KEY = "app:banner";

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  await redis.set(otpKey(phone), otp, "EX", 30);
  return res.status(200).json({ message: `Otp Successfully Sent ${otp}` });
});
app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));
  res.status(200).json({ message: `TTL of OTP for ${phone} is ${ttl}` });
});
app.post("/otp/verfy", async (req, res) => {
  const { phone, otp } = req.body;
  const savedOtp = await redis.get(otpKey(phone));
  if (!savedOtp) return res.status(401).json({ message: "OTP Expired or not found" });
  if (otp !== savedOtp) return res.status(401).json({ message: "Invalid OTP" });
  await redis.del(otpKey(phone));
  return res.status(200).json({ message: "OTP Verified Successfully" });
});

app.listen(port, () => {
  console.log(`Server is Successfully Listening on PORT ${port}`);
});
