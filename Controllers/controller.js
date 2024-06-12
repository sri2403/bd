import bcrypt from "bcryptjs";
import { User } from "../Models/schema.js";
import nodemailer from 'nodemailer';
import crypto from'crypto';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser=async(req,res)=>{
    try {
        const{username,email,password}=req.body;
        const hashPassword=await bcrypt.hash(password,10);
        const newUser=new User({username,email,password:hashPassword});
        await newUser.save();
        res.status(200).json({message:"User registered successfully",result:newUser})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Registration failed internal server error'})
    }
}

export const loginUser=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"User not found"})
        }
        const passwordMatch=await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid password"})
        }
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
          user.token = token;
          await user.save();

        res.status(200).json({message:"User logged-in successfully",token:token},);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Login failed internal server error'})
    }
}

export const getuser = async(req,res)=>{
    try {
      const userId = req.user._id
      const user = await User.findById(userId)
      res.status(200).json({message:"Authorized user",data:[user]})
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error Failed to get the user" });
    }
  }
  
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const newPassword = crypto.randomBytes(8).toString('hex');
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'sriharinimuthukrishnan@gmail.com',
                pass: 'jgzbvvlyofydqgbt' 
            }
        });

        const mailOptions = {
            from: "sriharinimuthukrishnan@gmail.com",
            to: user.email,
            subject: 'Password Reset',
            text: `Your new password is: ${newPassword}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error('Error sending email: ', error);
            res.status(500).json({ message: 'Error sending email' });
        }
    } catch (error) {
        console.error('Error during password reset process: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}