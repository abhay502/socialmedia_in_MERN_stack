import User from "../models/User.js";
import Post from '../models/Post.js'


//READ
export const getUser = async (req,res)=>{
    try {

        const  {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user)

    } catch (error) {

        res.status(404).json({message:error.message});

    }
}

export const getUserFriends = async (req,res)=>{ 
    try {

        const  {id} = req.params;
        const user = await User.findById(id);
        
        const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, location, picturePath})=>{
                return {_id, firstName, lastName, location, picturePath}
            }
        )
        
        res.status(200).json(formattedFriends);
    } catch (error) {

        res.status(404).json({message:error.message});
        
    }
}

//UPDATE

export const addRemoveFriends = async(req,res)=>{
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId)

        if(user.friends.includes(friendId)){

            user.friends = user.friends.filter((id)=>   id !== friendId)
            friend.friends = friend.friends.filter((id)=> id !== id)

        }else{
            user.friends.push(friendId)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()

        const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, location, picturePath})=>{
                return {_id, firstName, lastName, location, picturePath}
            }
        )
        
        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(404).json({message:error.message});
        
    }
}

export const getSearchedUsers = async (req,res)=>{
    try {
        const searchKey = await req.body.searchKey
        // console.log(searchKey)
        if(searchKey.length > 1){
            const users = await User.find({
                $or: [
                  { firstName: { $regex: searchKey, $options: "i" } },
                  { lastName: { $regex: searchKey, $options: "i" } },
                 
                ],
              });
            
            //  console.log(users)
            res.status(200).json({users})
        }
       
    } catch (error) {
         
    }
}
export const editProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedFirstName = req.body.firstName;
      const updatedLastName = req.body.lastName;
      const updatedEmail = req.body.email;
      const updatedNumber = req.body.number;
      const updatedPicturePath = req.body.profilePic;
      const updatedIsPrivate = req.body.isPrivate;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user data
      user.firstName = updatedFirstName;
      user.lastName = updatedLastName;
      user.email = updatedEmail;
      user.number = updatedNumber;
      user.isPrivate = updatedIsPrivate;
  
      // Check if a new profile picture was uploaded
      if (updatedPicturePath) {
        user.picturePath = updatedPicturePath;
      }
  
      // Save updated user data to the database
      await user.save();
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

export const getAllUsers = async (req,res)=>{
    try {
      
        const users = await User.find()
       
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}
export const blockUser = async (req,res)=>{ 
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        console.log(user)
       
        if(user.isBlocked){
            user.isBlocked = false  
            await user.save();
            res.status(200).json({ message: "User unblocked successfully" });
        }else{
            user.isBlocked = true;
            await user.save();
            res.status(200).json({ message: "User blocked successfully",userId:userId });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
} 
export const getUserForAdmin = async (req, res) => {
    try {
      const searchKey = req.params.searchKey;
      let user;
  
      if (searchKey) {
        user = await User.find({ firstName: { $regex: searchKey, $options: "i" }  });
      } else {
        user = await User.find({});
      }
  
      res.status(200).json(user);   
    } catch (error) {
      console.log(error); 
      res.status(500).json({ error: "Internal server error" });
    }
};
                                                            
export const getTotalActiveUsers = async(req,res)=>{ 
    try {
        const activeUsers = User.find({isBlocked:false})
        const totalFeed = Post.find()
        const totalActiveUsers = (await activeUsers).length;
        const totalFeedCount = (await totalFeed).length;
       
        res.status(200).json({totalActiveUsers:totalActiveUsers,totalFeedCount:totalFeedCount}); 
    } catch (error) {
        console.error(error); 
        throw new Error('Error fetching active users');
    }
}

export const getActiveDate = async(req,res)=>{
    try {
        const activeUsers = await User.find({isBlocked:false})
        res.status(200).json({activeUsers:activeUsers})
    } catch (error) {
        console.error(error); 
        throw new Error('Error fetching active users');
    }
}

  
       