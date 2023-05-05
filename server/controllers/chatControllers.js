import Chat from "../models/ChatModel.js";
import User from '../models/User.js'

export const accessChat = async (req,res)=>{
   
   
  try { 
    const LoginUserId=  req.body.LoginUserId
    const  userId  = req.body.profileUserId; 
    if(!userId){
        console.log("UserId param not send with request");
        return res.sendStatus(400);
    } 
                                    
    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{$eq: LoginUserId}}},
            {users:{$elemMatch:{$eq: userId}}}
        ]
    }).populate("users","-password").populate("latestMessage") 

    isChat = await User.populate(isChat,{
        path:'latestMessage.sender', 
        select:"firstName picturePath email",
    });

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[LoginUserId,userId]
        };

        try {
            
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password");

            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
  } catch (error) {
    console.log(error.message)
  }
} 

export const fetchChats = async (req, res) => {
    const userId = req.params.userId;
    const loginUserId = req.params.loginUserId;
  
    try {
      const results = await Chat.find({
        users: { $all: [userId, loginUserId] },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "firstName picturePath email",
          },
        })
        .exec();
  
      res.status(200).send(results);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
};

export const getInboxChats = async (req, res) => {
  const userId = req.params.id
  try {
      const results = await Chat.find({ users: { $all: [userId] } })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate({
              path: "latestMessage",
              populate: {
                  path: "sender",
                  select: "firstName picturePath email"
              }
          }).sort({'latestMessage.createdAt': 'desc'})
           
          .exec();

      
      console.log(results)
      res.status(200).send(results);
  } catch (error) {
      res.status(400);
      throw new Error(error.message); 
  }
}


  