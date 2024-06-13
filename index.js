import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./Database/config.js";
import router from "./Routers/router.js";

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({
    origin:"*",
    credentials:true
}));

app.use("/api",router);

connectDB();
app.get("/",(req,res)=>{
    res.status(200).send(`
    <h1>Node Day 6 Task</h1>
<p><strong>/register:</strong> Create a new user account.</p>
<p><strong>/login:</strong> Log in to an existing user account.</p>
<p><strong>/forgot-password:</strong> Reset your password if forgotten.</p>
<p><strong>/get-user:</strong> Retrieve user details if authenticated.</p>
<p><strong>/shortUrls:</strong> Shorten a given URL.</p>
<p>This is the main endpoint of our Node.js application for day 5 tasks, providing information about user account-related functionalities and URL shortening.</p>

`)
})
app.listen(process.env.PORT||3000,()=>{
    console.log("app is listening to the port");
})