import { useMediaQuery } from "@mui/material"
import { Box } from "@mui/system"

import { useSelector } from "react-redux";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/myPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget"; 
import Navbar from "../navbar/Navbar" 
import { useEffect, useState } from "react";

 

const HomePage = ()=>{ 
    const [user, setUser]= useState(null);
    const token =useSelector((state)=>state.token);
    const getUser = async ()=>{
        const response = await fetch(`http://localhost:3001/users/${_id}`,
        {
            method:"GET",
            headers:{Authorization:`Bearer ${token}`} 
        });

        const data = await response.json() 
        setUser(data) 
    };

    useEffect(()=>{ 
        getUser()  
    },[]) 
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)"); 
    const { _id,picturePath }=useSelector((state)=> state.user);
          
    const friends = useSelector((state)=> state.user.friends);
  

    return(
          
            <Box  > 

                <Navbar  style={{ height: '50px', position: 'relative', top: 0, left: 0, right: 0 }}  />
                <Box width="100%" 
                  padding="2rem 6%"
                  display={isNonMobileScreens ? "flex" :"block"}
                  gap="0.5rem"
                  justifyContent="space-between"
                  marginTop="5rem"
                  position="absolute"
                  zIndex="1"
                  >
                    <Box  flexBasis={isNonMobileScreens ? "26%" : undefined}>
                        <UserWidget   userId={_id} picturePath={user?.picturePath} />
                    </Box>

                    <Box flexBasis={isNonMobileScreens ? "42%" : undefined}

                         mt={isNonMobileScreens ? undefined :  "2rem"}>
                    <MyPostWidget picturePath={user?.picturePath} />
                    <PostsWidget userId={_id}/>
                        
                    </Box>
                   

                    {isNonMobileScreens && (
                        <Box flexBasis="26%">
                            <AdvertWidget /> 
                            <Box m="2rem 0" />
                            <FriendListWidget  userId={_id}/>
                        </Box> 
                        
                    )}
                </Box> 
            </Box>   
        
    ) 
}

export default HomePage;