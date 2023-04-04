import { Typography,Box,useTheme, useMediaQuery } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import { setFriends } from "state";


const FriendListWidget =({ userId }) => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    

    const dispatch = useDispatch()
    const { palette } = useTheme()
    const token = useSelector((state)=> state.token)           
    const friends = useSelector((state)=> state.user.friends); 
    
    
    const getFriends = async ()=>{ 
       
        const response = await fetch(`http://localhost:3001/users/${userId}/friends`,
        {
            method:"GET",
            headers:{Authorization:`Bearer ${token}`}
        }); 
       
        const data = await response.json();
        
        dispatch(setFriends({ friends:data})) 
    };

    useEffect(()=>{   
        getFriends()
    },[]); 
       
    return(
        <WidgetWrapper position={isNonMobileScreens ? "fixed" : undefined} marginTop="10.7rem" width="25%">
            <Typography 
            color={palette.neutral.dark}
            variant="h5"
            fontWeight="500"
            sx={{ mb:"1.5rem"}}
            >
               {friends.length<1? "0 Friends" : friends.length+ " Friends  List" } 
            </Typography>

            <Box display="flex" flexDirection="column" gap="1.5rem">
                {
                    
                    friends.length > 0 && friends?.map((friend)=>(
                       <Friend  
                       key={friend._id} 
                       friendId={friend._id}
                       name={`${friend.firstName}  ${friend.lastName}`}
                       subtitle={friend.location}
                       userPicturePath={friend.picturePath}
                       />
                    ))}
            </Box>
        </WidgetWrapper>
    )

}

export default FriendListWidget;