import { LockOutlined } from "@mui/icons-material";
import { Box, Typography, useMediaQuery } from "@mui/material";
import {  USERS_URL } from "Constants";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; 
import Navbar from "scenes/navbar/Navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/myPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget"; 
import UserWidget from "scenes/widgets/UserWidget";




const ProfilePage = () => {
    const Loginuser = useSelector((state) => state.user);
    const [user, setUser] = useState(null)
    const { userId } = useParams();
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    
   
    const getUser = useCallback(async () => {
        const response = await fetch(`${USERS_URL}/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      }, [userId, token]);

    useEffect(() => { 
        getUser()
        
    }, [getUser]);

    if (!user) return null;
    
    return (
        <Box> 
            <Navbar  />
            <Box marginTop="5rem" 
                  zIndex="1">
 
                <Box width="100%"
                    padding="2rem 6%"
                    display={isNonMobileScreens ? "flex" : "block"}
                    gap="0.5rem"
                    justifyContent="center"
                >
                    <Box position="relative" flexBasis={isNonMobileScreens ? "26%" : undefined}
                      ml={isNonMobileScreens ?  "-23rem" : undefined } >
                         
                        <UserWidget userId={userId} picturePath={user.picturePath} /> 
                        <Box m="20rem 0" />
                       
                    </Box>
                    <Box position="absolute" flexBasis={isNonMobileScreens ? "26%" : undefined}
                      ml={isNonMobileScreens ?  "40rem" : undefined }  mt={isNonMobileScreens ?  "-10.6rem" : undefined } >
                         
                       
                        <FriendListWidget userId={userId} />
                    </Box>
 
                    <Box  flexBasis={isNonMobileScreens ? "42%" : undefined}

                        mt={isNonMobileScreens ? undefined : "2rem"}
                      ml={isNonMobileScreens ?  "1rem" : undefined } >
                      
                           
                        <MyPostWidget picturePath={Loginuser.picturePath} /> 
                        <Box m="2rem 0" />

                        {user?.isPrivate ? user?.friends?.includes(Loginuser._id) || user?._id === Loginuser._id ?

                        <PostsWidget userId={userId} isProfile />
                        :
                        
                        <Box ml={"1rem"} mt={"5rem"} display="flex" flexDirection="column" alignItems="center">
                        <Box display="flex" alignItems="center" mb={1}>
                            <LockOutlined />
                            <Typography variant="h2" ml={1}>This account is private</Typography>
                        </Box>
                        <Typography variant="body1" textAlign="center">Follow this account to see their photos and videos.</Typography>
                        </Box>  : null}
                       

                    </Box>
                </Box>
                   
            </Box>
           
        </Box>
        
    )
}

export default ProfilePage 