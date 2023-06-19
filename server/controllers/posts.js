import Post from '../models/Post.js'
import ReportPost from '../models/ReportedPost.js';
import User from '../models/User.js'

export const createPost = async (req,res)=>{
    try {
        const { userId, description, picturePath, videoPath } = req.body; 
        const user = await User.findById(userId)
        const currentDate = new Date() 
       

        const newPost = new Post({
            userId,
           
            location:user.location, 
            description, 
            
            picturePath: picturePath || "",
            videoPath: videoPath || "",
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
        
        const post = await Post.find().sort({ _id:   -1 }); //this will find all the posts to front end after creating a new posts.
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
        
            post.comments.unshift({userId:userId,comment:comment,Username:Username,userPicture:userPicture, createdAt: new Date()});
    
        const updatedPost = await Post.findByIdAndUpdate(id,
            { comments:post.comments },{new:true})
            
        res.status(200).json(updatedPost) //200 represents successfull request

    } catch (error) {
        res.status(404).json({message:error.message})
        
    }
}

export const deletePostComment = async (req,res)=>{
    try {

        const {id}=req.params
        const {userId}=req.body
        const post = await Post.findById(id);
       
          
          const index = post.comments.findIndex(comment => comment.userId === userId);
          
          if (index !== -1) {
            post.comments.splice(index, 1);
            console.log(`Comment with userId ${userId} has been deleted.`);
            await post.save();

          } else {
            console.log(`Comment with userId ${userId} not found.`);
          }

          const updatedPost = await Post.findByIdAndUpdate(id,
            { likes:post.likes },{new:true})
            
        res.status(200).json(updatedPost) //200 represents successfull request
       
    } catch (error) {
        
    }
}
export const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
     
      
  
      
      await Post.findByIdAndDelete(id); 
      await ReportPost.findOneAndDelete({postId:id}); 
      const post = await Post.find().sort({ _id: -1 }); //this will find all the posts to front end after creating a new posts.
        res.status(200).json(post) //200 represents successfull request
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};
export const getPostToEdit = async (req,res) =>{
    try {
        const {postId} = req.params;
        const post = await Post.findById(postId);
        res.status(200).json(post)
 
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}

export const submitEditPost = async (req,res) =>{
    try {
        const {postId} = req.params;
        const newDescription = req.body.description;

        const updatedPost = await Post.findOneAndUpdate(
            {_id: postId},
            {description: newDescription},
            {new: true}
        );

        res.json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: "Error updating post description." });
    }
}

export const reportPost =async (req,res)=>{
    try {
        const {postId}=req.params
        const currentDate = new Date() 
        const userId = req.body.userId;
        const reportReason = req.body.reportReason
        
      
      
        const newReportPost = new ReportPost({
            userId,
            postId,
            reportReason,
            createdAt: currentDate
        })
        await  newReportPost.save();

    } catch (error) {
        res.status(500).json({ message: "Error Reporting Post." });
    }
}
export const getAllReportedPosts = async (req, res) => {
    try {
        const sortOrder = req.query.sort
    
        if(sortOrder === 'asc'){
            var reportedPosts = await ReportPost.find().sort({ _id: -1 });
        }else{
            var reportedPosts = await ReportPost.find().sort({ _id: 1 }); 
        }
      
      
      // Get all the unique postIds from the reported posts array
      const uniquePostIds = [...new Set(reportedPosts.map(rp => rp.postId))];
      const uniqueUserIds = [...new Set(reportedPosts.map(rp => rp.userId))];
  
      // Find all the posts in the Posts collection that match the unique postIds from the reported posts array
      const posts = await Post.find({ _id: { $in: uniquePostIds } });
      const users = await User.find({_id:{ $in: uniqueUserIds }})
  
      // Combine the reported posts and their corresponding posts into a single object
      const reportedPostsWithPosts = reportedPosts.map(rp => ({
        postId: rp.postId, 
        userId:rp.userId,
        reportReason:rp.reportReason,
        createdAt:rp.createdAt,
        post: posts.find(p => p._id.toString() === rp.postId.toString()),
        reportedUser: users.find(p => p._id.toString() === rp.userId.toString())
      }));
   
      res.status(200).json(reportedPostsWithPosts);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};
export const getThatPost = async (req,res)=>{
    try { 
         
      const post = await Post.find({ _id:req.params.postId });
     
      const postedUserId = [...new Set(post.map(pst => pst.userId))];
      const postedUser = await User.find({_id:{ $in: postedUserId }})
       
      const finalResult= [{post,postedUser}]
      console.log(finalResult)
      res.status(200).json(finalResult);
    } catch (error) {
      res.status(404).json({ message: error.message });
        
    }
}
  
   
