import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { USERS_URL } from "Constants";

const { Typography } = require("@mui/material")


const CommentList = ({userId})=>{
    const { palette } = useTheme();
  const navigate = useNavigate();
  const main = palette.neutral.main;
  const [user, setUser] = useState(null) 
  const token = useSelector((state) => state.token);

    const getUser = async () => {

        const response = await fetch(`${USERS_URL}/${userId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            })
    
        const data = await response.json(); 
        setUser(data);
    }
    
    useEffect(() => {
        getUser()
    }, []);
  

    return(
        <>
        <FlexBetween gap={"0.8rem"}  onClick={() => {
            navigate(`/profile/${user?._id}`);
            navigate(0);
          }}>
             
            <UserImage image={user?.picturePath} size={"34px"} /> 
            <Typography
            color={main}
           
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              }, 
            }}
          >
            {user?.firstName+ " "+user?.lastName} -
          </Typography> 
           
           
        </FlexBetween>
        </>
    )
}

export default CommentList;