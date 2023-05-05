import mongoose from 'mongoose'

const reportPostSchema = mongoose.Schema(
    {
        userId:{type:String,required:true},
        postId:{type:String,required:true},
        reportReason:{type:String,required:true}

    },
    { timestamps:true }
)

const ReportPost = mongoose.model("ReportPost",reportPostSchema );
export default ReportPost;