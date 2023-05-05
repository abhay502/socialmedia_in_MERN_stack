import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/User.js";

export const sendMessage = async(req,res)=>{

    const { content,chatId } = req.body; 
    // console.log("hAreesh")
    // console.log(content,chatId)
    if(!content || !chatId ){
        console.log("Invalid data passed into request ");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender:req.body.senderId,
        content:content, 
        chat:chatId,
    };

    try { 
        var message = await Message.create(newMessage);
        message = await message.populate("sender","firstName picturePath")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path:"chat.users",
            select:"firstName picturePath email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message, 
        });

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
 
} 

export const allMessages = async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","firstName picturePath email").populate("chat");
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error (error.message);
    }
}  