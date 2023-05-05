import{
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    MessageOutlined,
    PersonRemoveOutlined,
    PersonAddOutlined,
    
} from '@mui/icons-material';
import { Box, Typography, Divider, useTheme, useMediaQuery, Button, IconButton } from '@mui/material';
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHATS_URL, USERS_URL } from 'Constants';
import { setFriends } from "state";




const UserWidget = ({userId, picturePath})=>{
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const LoginUser = useSelector((state) => state.user);
    const [user, setUser]= useState(null);
    const {palette} = useTheme(); 
    const navigate=useNavigate() 
    const token =useSelector((state)=>state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium
    const main = palette.neutral.main;
    const dispatch = useDispatch();
    const Userfriends = useSelector((state) => state.user.friends);
    const friendsArray = Object.values(Userfriends);
    
   
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
   
    const userChat = async () => {
        console.log(LoginUser)
        const response = await fetch(`${CHATS_URL}/${userId}`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json" },
            body:JSON.stringify({LoginUserId:LoginUser?._id,profileUserId:userId})
        })
 
    const data = await response.json();
    }
  
    const isFriend = friendsArray.find((friend) => friend._id === userId);
    const patchFriend = async () => {
        const response = await fetch(
          `${USERS_URL}/${LoginUser._id}/${userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
      };
    const getUser = async ()=>{
        const response = await fetch(`http://localhost:3001/users/${userId}`,
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
 
    if(!user)return null;

    const { firstName,lastName,location,viewedProfile, impressions, friends } = user

    return(
        <WidgetWrapper  position={isNonMobileScreens ? "fixed" : undefined}   >
            <FlexBetween 
             gap="0.5rem"
             pb="1.1rem"
             onClick={()=> navigate(`/profile/${userId}`)}
            >    
             {/* First ROW */}
                <FlexBetween gap="1rem">
                    <UserImage image={user?.picturePath} />
                    <Box>
                        <Typography 
                         variant='h4'
                         color={dark}
                         fontWeight="500"
                         sx={{"&:hover" : {
                            color:palette.primary.light,
                            cursor:"pointer"
                         }
                        }}
                        > 
                        {firstName} {lastName}
                        </Typography>
                        <Typography color={medium}> {friends.length} friends</Typography>
                    </Box>
                </FlexBetween>

               
                </FlexBetween>
                
                {LoginUser._id !== userId ?<> <Button onClick={()=>{navigate(`/chatwith/${userId}`);userChat()}}><MessageOutlined/> <Typography>  Send Message</Typography></Button> 
                <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, ml: "2rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : ( 
          <PersonAddOutlined sx={{ color: primaryDark }} /> 
        )}
      </IconButton>
                </>
                : 
                <><Button onClick={() => navigate(`/editProfile/${userId}`)}>
                    <ManageAccountsOutlined />
                    <Typography>Edit Profile</Typography>
                    </Button> 
                    <Button onClick={() => navigate(`/inbox/${userId}`)}>
                        <MessageOutlined />
                        <Typography>All Messages</Typography>
                    </Button>
                    </>
                }
          
                      
                <Divider/>  {/* dividing FIRST ROW AND SECOND ROW */} 
                {/* SECOND ROW */}

                <Box p="1rem 0">
                    <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                         <LocationOnOutlined fontSize='large' sx={{color:main}} />
                         <Typography color={medium}>{location}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="1rem" >
                         <WorkOutlineOutlined fontSize='large' sx={{color:main}} />
                         <Typography color={medium}>Ocuupation illalo vere thelum idu</Typography>
                    </Box>
                </Box>
                <Divider/>  {/* dividing FIRST ROW AND SECOND ROW */}

                {/* THIRD ROW */}
                
                <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Who's viewed your profile</Typography>
                        <Typography color={main} fontWeight="500">{viewedProfile}</Typography>

                    </FlexBetween>
                    <FlexBetween>
                    <Typography color={medium}>impressions of your profile</Typography>
                    <Typography color={main} fontWeight="500">{impressions}</Typography>
                    </FlexBetween>
                </Box>
                <Divider/>  {/* dividing FIRST ROW AND SECOND ROW */}

                {/* FOURT ROW */}
 
                <Box p="1rem 0">
                    <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                        Social Profiles
                    </Typography>


                    <FlexBetween gap="1rem" mb="0.5rem">
                        <FlexBetween gap="1rem" >
                            <img src='../assets/twitter.png' alt="twitter"/>
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    Twitter
                                </Typography>
                                <Typography color={medium}>
                                    Social Network
                                </Typography>
                            </Box>
                        </FlexBetween>
                        
                      {LoginUser._id !== userId ? null : <EditOutlined sx={{color:main}}/>}
                    </FlexBetween>

                    <FlexBetween gap="1rem" >
                        <FlexBetween gap="1rem" >
                            <img src='../assets/linkedin.png' alt="linkedIn"/>
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    LinkedIn
                                </Typography>
                                <Typography color={medium}>
                                    Network Platform 
                                </Typography>
                            </Box>
                        </FlexBetween>
                        {LoginUser._id !== userId ? null : <EditOutlined sx={{color:main}}/>}

                    </FlexBetween>


                </Box>

        </WidgetWrapper>
    )
}

export default UserWidget