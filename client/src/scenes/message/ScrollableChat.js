import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "./ChatLogic";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import { Box, Typography } from "@mui/material";


const ScrollableChat = ( {messages} )=>{
    const Loginuser = useSelector((state) => state.user);
  
    return(
        <>
         <ScrollableFeed>
 
            {messages && 
             messages.map((m,i)=>
              <div style={{display:"flex",marginTop:"0.5rem"}} key={m._id}>
                {<>
                <Box sx={{mt:'0.4rem'}}>
                {(isSameSender(messages,m,i,Loginuser?._id)
                    || isLastMessage(messages,i,Loginuser?._id)
                    )&&(
                   <UserImage image={m?.sender?.picturePath} size="25px" />
                    )}
                </Box>
                   
                   <Typography style={{backgroundColor:`${m?.sender?._id === Loginuser?._id ? "#BEE3F8" : "#B9F5D0"}`,
                   color:`${m?.sender?._id === Loginuser?._id ? "black" : "black"}`,
                     borderRadius:"20px",padding:"5px 15px", maxWidth:"75%", marginLeft:isSameSenderMargin(messages,m,i,Loginuser?._id),
                     marginTop:isSameUser(messages,m,i,Loginuser?._id)? 3:10,marginRight:'1rem'}}
                     > {m?.content} </Typography>
                   </>
                }
            </div>)}
         </ScrollableFeed>

        </>
    )
}

export default ScrollableChat;