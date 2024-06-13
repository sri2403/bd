import mongoose from "mongoose";
import shortid from "shortid";

const userSchema= mongoose.Schema({
    username:String,
    email:String,
    password:String,
    token:String
})

export const User=mongoose.model("User",userSchema);

const shortUrlSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        default:shortid.generate
    }
})

export const Url=mongoose.model("Url",shortUrlSchema)