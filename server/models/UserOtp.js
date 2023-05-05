import mongoose from "mongoose";

const UserOtpSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    otp:{
        type:String,
        required:true,

    }
});
//user otp model
const userotp = mongoose.model("userotp",UserOtpSchema);

export default userotp;