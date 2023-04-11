import User from "../models/User.js";

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
      console.log(updatedPicturePath)
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user data
      user.firstName = updatedFirstName;
      user.lastName = updatedLastName;
      user.email = updatedEmail;
      user.number = updatedNumber;
      user.picturePath = updatedPicturePath;
  
      // Save updated user data to the database
      await user.save(user.picturePath );
       console.log()
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  