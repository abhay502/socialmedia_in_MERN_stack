import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  setAdminLogout } from "state"
import { Instagram } from "@mui/icons-material";
const { Typography, Button, Box } = require("@mui/material")


const AdminNavbar = () =>{
    const navigate = useNavigate()
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
const dispatch = useDispatch();
    return(
        <FlexBetween  padding="1rem" backgroundColor={alt} position="fixed" top="0" left="0" width="100%" zIndex="999"  >
        <Box paddingLeft="5rem" display={"flex"} width="50%" >
                <Typography fontWeight="bold"
                    fontSize="2rem"
                    color="primary"
                    onClick={() => navigate("/adminhome")}
                    sx={{
                        "&:hover": { 
                            color: primaryLight,
                            cursor: "pointer",

                        },

                    }}><Instagram/> Admin Panel Instagram</Typography>
                    </Box>
                    <Button  onClick={()=>dispatch(setAdminLogout())}>Admin Logout</Button>
                    
        </FlexBetween>
    )
}
export default AdminNavbar;