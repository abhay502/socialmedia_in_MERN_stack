import { CHATS_URL } from "Constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar/Navbar";
import { Typography, Box } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";

const MessageComponent = () => {
    const navigate = useNavigate()

    const { userId } = useParams();
    const token = useSelector((state) => state.token);
    const [chats, setChats] = useState([]);

    const fetchAllChats = async () => {
        const response = await fetch(`${CHATS_URL}/inbox/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setChats(data);
    };

    useEffect(() => {
        fetchAllChats();
    }, []);
    const getTimeString = (date) => {
        const diff = Math.round((new Date() - date) / 1000); // difference in seconds
        if (diff < 60) {
            return "just now";
        } else if (diff < 3600) {
            return Math.round(diff / 60) + " minutes ago";
        } else if (diff < 86400) {
            return Math.round(diff / 3600) + " hours ago";
        } else if (diff < 604800) {
            return Math.round(diff / 86400) + " days ago";
        } else {
            return date.toLocaleString();
        }
    };
    
   
    return (
        <>
            <Navbar />
            <Box sx={{ mt: "8rem", pl: "10rem" }}>
    <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        All Messages in inbox 📩
    </Typography>
    <Box>
        {chats.map((chat) => (
            <Box key={chat._id} sx={{ mt: "2rem", p: "1rem", border: "2px solid white" ,width:'30%', borderRadius:'2rem'}}>
                <Box display={"flex"} sx={{p:'0.5rem'}} >
                    {chat?.users?.map((user) => {
                        if (user?._id !== userId) {
                            return (
                                
                                    <Box key={user._id} display={"flex"} gap={"0.6rem"}>
                                    <UserImage image={user?.picturePath} size="45px" />
                                    <Typography onClick={() => navigate(`/chatwith/${user._id}`)} style={{  cursor: 'pointer' }} variant="h5">{user?.firstName}</Typography>
                                    </Box>
                                 
                            )
                        } else { 
                            return null
                        }
                    })}
                </Box>
                <Typography  sx={{ml:"3.9rem", mt:'-2rem',color:'grey',fontStyle:"revert"}}> 
                    {chat?.latestMessage?.sender?._id === userId ? " you : "+ chat?.latestMessage?.content: chat?.latestMessage?.content }
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" ,ml:"3.9rem"}}>
                    {getTimeString(new Date(chat?.latestMessage?.createdAt))}
                </Typography>
            </Box>
        ))} 
    </Box>
</Box>

        </>
    );
};

export default MessageComponent;
