import Post from '../models/Post.js'
import User from '../models/User.js'

export const createPost = async (req,res)=>{
    try {
        const { userId, description, picturePath } = req.body; 
        const user = await User.findById(userId)
        const currentDate = new Date() 
        //  .toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[],
            createdAt: currentDate
        })
        await  newPost.save();

        const post = await Post.find().sort({_id:-1}); //this will find all the posts to front end after creating a new posts.
        res.status(201).json(post) //201 represents created something
    } catch (error) {
        res.status(409).json({message:error.message})
    }
}

export const getFeedPosts = async (req,res) =>{
    try {
        
        const post = await Post.find().sort({ _id: -1 }); //this will find all the posts to front end after creating a new posts.
        res.status(200).json(post) //200 represents successfull request

    } catch (error) {
        res.status(404).json({message:error.message})
        
    }
}

export const getUserPosts = async (req,res)=>{
    try {
        const { userId } = req.params;
        const post = await Post.find({userId}); //this will find all the posts to front end after creating a new posts.
        res.status(200).json(post) //200 represents successfull request

    } catch (error) {
        res.status(404).json({message:error.message})
        
    }
}

export const likePost = async(req,res)=>{
    try {

        const {id}=req.params
        const {userId}=req.body
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId)

        if(isLiked){
            post.likes.delete(userId)
        }else{
            post.likes.set(userId,true);
        }

        const updatedPost = await Post.findByIdAndUpdate(id,
            { likes:post.likes },{new:true})
            
        res.status(200).json(updatedPost) //200 represents successfull request

    } catch (error) {
        res.status(404).json({message:error.message})
        
    }
}

export const commentPost = async(req,res)=>{
    try {

        const {id}=req.params
        const {userId}=req.body
        const {Username}=req.body;
        const {comment}=req.body
        const {userPicture}=req.body;
        
        const post = await Post.findById(id);
        // const isCommented = post.comments.includes(userId)

        // if(isCommented){
        //     post.comments.pop(userId)
        // }else{
            post.comments.unshift({userId:userId,comment:comment,Username:Username,userPicture:userPicture, createdAt: new Date()});
        // }

        const updatedPost = await Post.findByIdAndUpdate(id,
            { comments:post.comments },{new:true})
            
        res.status(200).json(updatedPost) //200 represents successfull request

    } catch (error) {
        res.status(404).json({message:error.message})
        
    }
}