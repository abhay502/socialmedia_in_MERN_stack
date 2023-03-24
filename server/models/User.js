import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    lastName:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:5,
        
    },
    picturePath:{
        type:String,
        default:""
    },
    friends:{
        type:Array,
        default:[]
    },
    number:{
        type:Number,
        required:true,
        min:9
    },
    location:String,
    viewedProfile:Number,
    impressions:Number


},{ timestamps:true });

const User = mongoose.model("User",UserSchema);

export default User;