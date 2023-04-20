
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const { Typography, Button, Box } = require("@mui/material")


const AdminPanel = ()=>{
    const navigate = useNavigate()
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light; 
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const dispatch = useDispatch();

    return(
        <>
        
        <AdminNavbar />
        <Box gap={'1rem'} width='50%' height="40%" sx={{mt:'10rem',ml:'21rem',display:'grid'}}>
          <Typography variant="h5" fontWeight='bold' ml='19rem'>Admin Panel Menu</Typography>

          <Button onClick={()=>navigate('/usermanagement')} sx={{ borderRadius: '20px ', border:'1px solid ' }}><Typography variant="h3" fontWeight={"bold"}>USER MANAGEMENT</Typography></Button>
          <Button sx={{ borderRadius: '20px ', border:'1px solid '}}><Typography variant="h3" fontWeight={"bold"}>POST MANAGEMENT</Typography></Button>
          <Button sx={{ borderRadius: '20px ', border:'1px solid '}}><Typography variant="h3" fontWeight={"bold"}>ANALYTICS AND INSIGHTS</Typography></Button>

        </Box>
        </>
       
    )
}
 export default AdminPanel; 