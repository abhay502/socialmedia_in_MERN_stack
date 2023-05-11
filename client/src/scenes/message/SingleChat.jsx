import { useTheme } from "@emotion/react";
import { CHATS_URL, MESSAGE_URL, USERS_URL } from "Constants";

import UserImage from "components/UserImage";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar/Navbar";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'; 
import { setNotification } from "state";

const { Typography, Box, Divider, FormControl, Input } = require("@mui/material")

const ENDPOINT = "http://localhost:3001";
var socket, selectedChatCompare;

const SingleChat = () => {
    const { userId } = useParams();
    const Loginuser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    const token = useSelector((state) => state.token);
     
    const [user, setUser] = useState("")

    const navigate = useNavigate();
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;


    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [selectedChat, setSelectedChat] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [notification, setNotificationn] = useState([]);

    const fetchChats = useCallback(async () => {
        const response = await fetch(`${CHATS_URL}/${userId}/${Loginuser?._id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, }
        });
        const data = await response.json();
        setSelectedChat(data)
    }, [userId, Loginuser, token]); 

    const fetchMessages = useCallback(async () => {
        if (selectedChat.length < 1) return;
        try {
          const response = await fetch(`${MESSAGE_URL}/${selectedChat[0]?._id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setMessages(data);
          socket.emit("join chat", selectedChat[0]._id);
        } catch (error) {
          console.log(error.message);
        } 
      }, [selectedChat, token]);

   
 
      const getUser = useCallback(async () => {
        const response = await fetch(`${USERS_URL}/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, }
        });
        const data = await response.json();
        setUser(data)
      }, [userId, token]);

    useEffect(() => { 
        socket = io(ENDPOINT); 
        socket.emit("setup", Loginuser);
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true)) 
        socket.on('stop typing', () => setIsTyping(false));

        getUser()
        fetchChats()
    }, [fetchChats,getUser,Loginuser]);  

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                socket.emit('stop typing', selectedChat[0]._id)


                if (newMessage && newMessage.trim()) { // Check that comment is not empty or only whitespace
                    setNewMessage(newMessage.trim()); // Update comment state to remove whitespace
                    setNewMessage("")
                    const response = await fetch(`${MESSAGE_URL}/sendmessage`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ content: newMessage, chatId: selectedChat[0]?._id, senderId: Loginuser?._id })

                    })
                    const data = await response.json();
                    socket.emit("new message", data)
                    setMessages([...messages, data])
                }

            } catch (error) {
                console.log(error.message)
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat[0]._id);
           
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat[0]._id);
                setTyping(false);
            }
        }, timerLength)
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    }, [selectedChat,fetchMessages]);

   
    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

                if(!notification.includes(newMessageRecieved)){
                    setNotificationn([newMessageRecieved,...notification]);
                    try {
                        const newNoty = [newMessageRecieved,...notification]
                        dispatch(setNotification({notification:newNoty}));
                    } catch (error) {
                        console.error(error); 
                    } 
                    fetchChats()
                }

                setMessages([...messages, newMessageRecieved]); // this is I modified

            } else {
                setMessages([...messages, newMessageRecieved]);


            }
        })
    })
 

    if (!user) {
        return null
    }

    return (
        <>
            <Box sx={{ overflow: 'hidden' }}>


                <Navbar />
                <Box sx={{ mt: '5rem', p: '1rem', position: 'relative' }}>
                    <Box sx={{ p: '2rem' }} width={"40%"}>
                        <Box display={"flex"} gap={"1.2rem"}>
                            <UserImage image={user?.picturePath} size="55px" />
                            <Box
                                onClick={() => {
                                    navigate(`/profile/${userId}`);
                                    navigate(0);
                                }}
                                sx={{ mt: '0.5rem' }}
                            >
                                <Typography
                                    color={main}
                                    variant="h5"
                                    fontWeight="500"
                                    sx={{
                                        "&:hover": {
                                            color: palette.primary.light,
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    {user?.firstName + " " + user?.lastName}
                                </Typography>
                                <Typography color={medium} fontSize="0.75rem">
                                    {user?.location}
                                </Typography>
                                {isTyping && (
                                    <Box sx={{ position: 'absolute', }}>
                                        <Typography gap={'0.5rem'} sx={{ color: 'green' }}>
                                            typing......
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box>
                            <Divider sx={{ mt: '1.5rem' }} />
                            <Box sx={{ maxHeight: '50vh', overflowY: 'scroll', overflow: 'auto' }}>
                                <ScrollableChat messages={messages} />
                            </Box>
                            <FormControl
                                onKeyDown={sendMessage}
                                required
                                sx={{ mt: '3rem', width: '100%', position: 'relative' }}
                            >
                                <Input
                                    placeholder="Enter a message....."
                                    onChange={typingHandler}
                                    value={newMessage}
                                    sx={{
                                        border: '2px solid lightblue',
                                        borderRadius: '1rem',
                                        padding: '0.3rem',
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>

            </Box>

        </>
    )
}

export default SingleChat;