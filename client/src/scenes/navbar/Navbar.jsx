
import { useEffect, useState } from "react"
import {
    Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery, List, ListItem, MenuList,

} from "@mui/material"

import {
    Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close,
} from "@mui/icons-material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from "react-redux"
import { setMode, setLogout,setNotification } from "state"
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchResults from "./SearchResult"
import UserImage from "components/UserImage"
import { USERS_URL } from "Constants"
import { getSender } from "scenes/message/ChatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";





const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const notification = useSelector((state)=> state.notification)
   
    const [loggedIn, setLoggedInUser] = useState(null)
    const getUser = async () => {

        const response = await fetch(`${USERS_URL}/${user?._id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            })

        const data = await response.json();
        setLoggedInUser(data);
    }

    useEffect(() => {
        getUser()
    }, []);



    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")



    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = `${user?.firstName}  ${user?.lastName}`

    const [search, setSearch] = useState("");
    const [searchedResults, setSearchedResults] = useState("")
   


    const searchUsers = async () => {
        // if (search.trim() === '') {
        //   setSearchedResults('');
        //   return;
        // }

        const response = await fetch(`${USERS_URL}/searchUsers`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchKey: search }),
        });

        const Results = await response.json();
        setSearchedResults(Results);
    };

    

    useEffect(() => {
        // reset searched results when search query is empty
        if (search.trim() === '') {
            setSearchedResults('');
        }
    }, [search]);




    const resultsArray = Object.values(searchedResults);

    const results = resultsArray;
    
    return (
        <>
            <FlexBetween marginBottom="1rem" padding='1rem 6% ' backgroundColor={alt} position="fixed" top="0" left="0" width="100%" zIndex="999"  >
                <FlexBetween gap="1.75rem">
                    <Typography fontWeight="bold"
                        fontSize="clamp(1rem,2rem,2.25rem)"
                        color="primary"
                        onClick={() => navigate("/home")}
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                cursor: "pointer",

                            },

                        }}>Instagram</Typography>
                    {isNonMobileScreens && (
                        <>
                            <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                                <InputBase placeholder="Search.." onChange={(e) => {


                                    setSearch(e?.target?.value)

                                }} onKeyUp={() => searchUsers()} value={search} />
                                <IconButton>
                                    <Search />

                                </IconButton>


                            </FlexBetween>


                        </>
                    )}
                    {/* DESKTOP NAV */}
                    {isNonMobileScreens ? (
                        <FlexBetween gap="2rem">
                            <IconButton onClick={() => dispatch(setMode())}>
                                {theme.palette.mode === "dark" ? (
                                    <DarkMode sx={{ fontSize: "25px" }} />
                                ) : (
                                    <LightMode sx={{ color: dark, fontSize: "25px" }} />
                                )}
                            </IconButton>
                            <Message sx={{ fontSize: "25px" }} />
                            <Box>

                            <NotificationBadge  count={notification?.length}
                                effect={Effect.SCALE}
                            />
                            <NotificationsIcon onClick={handleNotificationClick} sx={{ fontSize: "25px", cursor: "pointer" }} />
                            </Box>

                            {showNotifications && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "60px",
                                        width: '15rem',
                                        backgroundColor: "grey",
                                        marginLeft: '4rem',
                                        padding: "1rem",
                                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                                        zIndex: "1",
                                    }}
                                >
                                  <MenuList> 
                                    {!notification?.length && "No new Messages"}
                                    {notification?.map(notify=>( 
                                        
                                        <MenuItem key={notify?._id} onClick={()=>{
                                            navigate(`/inbox/${user._id}`)
                                            dispatch(setNotification(notification.filter((n)=>n!==notify)))
                                        }}>
                                            {notify?.chat?.isGroupChat?`New message in ${notify?.chat?.chatName}`:`📩New message from ${getSender(user,notify?.chat?.users)}`}
                                        </MenuItem>
                                    ))}
                                  </MenuList>



                                </Box>
                            )}
                            <Help sx={{ fontSize: "25px" }} />
                            <FormControl variant="standard" value={loggedIn?.firstName + " " + loggedIn?.lastName}></FormControl>
                            <Select value={loggedIn?.firstName + " " + loggedIn?.lastName} sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem"
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight
                                }
                            }}
                                input={<InputBase />}

                            >
                                {loggedIn && (
                                    <MenuItem value={loggedIn.firstName + " " + loggedIn.lastName}>
                                        <Typography>{loggedIn.firstName + " " + loggedIn.lastName}</Typography>
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                            </Select>
                        </FlexBetween>
                    ) : (
                        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                            <Menu />
                        </IconButton>

                    )}
                    {/* MOBILE NAV */}
                    {!isNonMobileScreens && isMobileMenuToggled && (
                        <Box position="fixed" right="0" bottom="0" height="100%" zIndex="10" maxWidth="500px" minWidth="300px" backgroundColor={background}>
                            {/*  CLOSE ICON */}
                            <Box display="flex" justifyContent="flex-end" p='1rem' >
                                <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                                    <Close />
                                </IconButton>
                            </Box>
                            {/* MENU ITEMS */}

                            <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
                                <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}>
                                    {theme.palette.mode === "dark" ? (
                                        <DarkMode sx={{ fontSize: "25px" }} />
                                    ) : (
                                        <LightMode sx={{ color: dark, fontSize: "25px" }} />
                                    )}
                                </IconButton>
                                <Message sx={{ fontSize: "25px" }} />
                                <Notifications sx={{ fontSize: "25px" }} />
                                <Help sx={{ fontSize: "25px" }} />
                                <FormControl variant="standard" value={fullName}></FormControl>
                                <Select value={fullName} sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem"
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight
                                    }
                                }}
                                    input={<InputBase />}

                                >
                                    <MenuItem value={fullName}>
                                        <Typography>{fullName}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                                </Select>
                            </FlexBetween>

                        </Box>
                    )}
                </FlexBetween>
                {results.length === 0 && search !== '' ? <Typography color={"white"}>No Search Results</Typography> : <Typography>sfsdf</Typography>}

            </FlexBetween>
            <Box zIndex={2} padding='1rem 6% ' position="absolute" left="0" width="31.9%"  >
                <>

                    {searchedResults ? <Box borderRadius="0.5rem" backgroundColor="black" sx={{ marginTop: '5rem' }}>
                        <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>

                        </Typography>
                        <List>
                            {results[0]?.map((result) => (

                                <ListItem
                                    sx={{ backgroundColor: "lightslategrey" }}
                                    button
                                    key={result?._id}
                                    onClick={() => {
                                        navigate(`/profile/${result?._id}`)
                                    }}
                                >
                                    <UserImage image={result?.picturePath} />
                                    <Box display={"grid"}>
                                        <Typography ml={"1rem"} sx={{ fontWeight: "bold" }}> {result?.firstName + " " + result?.lastName}</Typography>
                                        <Typography ml={"1rem"} sx={{ fontSize: 12 }}> {result?.location}</Typography>
                                    </Box>



                                </ListItem>
                            ))}
                        </List>
                    </Box> : null}

                </>

            </Box>



        </>

    )
}

export default Navbar 