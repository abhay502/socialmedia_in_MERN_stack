import { DownloadOutlined, EmailOutlined, SimCardAlertRounded, VerifiedUserOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { blue, green, yellow } from "@mui/material/colors";
import AdminNavbar from "Admin/AdminNavbar";
import StactBox from "./StactBox";
import { USERS_URL } from "Constants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";
 

 
const Analytics = () => { 
  const token = useSelector((state) => state.adminToken);
  const [activeUsers,setActiveUsers] = useState("");
    const totalActiveUsers = async ()=>{
        const response = await fetch(
            `${USERS_URL}/get/totalActiveUsers`,
            { 
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json(); 
          setActiveUsers(data)
    }

    useEffect(()=>{
        totalActiveUsers()
    },[])  
    console.log(activeUsers)
    return ( 
        <> 
            <AdminNavbar />
            <Box m={"100px"}>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant="h2" fontWeight={"bold"}>Welcome to Admin Dashboard</Typography>
                </Box>
                <Box ml={"70rem"}>      
                    <Button sx={{ backgroundColor: blue[600] }}>
                        <DownloadOutlined />
                        Download Reports
                    </Button>
                </Box>
 
                {/* GRIDS AND CHARTS */}

                <Box display={"grid"} mt={"2rem"} gridTemplateColumns={"repeat(9,1fr)"} gridAutoRows={"140px"} gap={"70px"}>
                    {/* ROW 1 */}

                    <Box  gridColumn={"span 3"} backgroundColor={blue[700]} display={"flex"} alignItems={"center"} justifyContent={"center"}>

                        <StactBox title={activeUsers?.totalActiveUsers} subtitle={"Total Active Users 👤"} progress={activeUsers?.totalActiveUsers} increase={"+5%"} icon={<VerifiedUserOutlined />} />
 
       
                    </Box>
  
                    <Box gridColumn={"span 3"} backgroundColor={blue[700]} display={"flex"} alignItems={"center"} justifyContent={"center"}>

                        <StactBox title={"12,361"} subtitle={"Feedbacks"} progress={"0.75"} increase={"+14%"} icon={<EmailOutlined />} />


                    </Box> 
                    <Box gridColumn={"span 3"}  backgroundColor={yellow[700]} display={"flex"} alignItems={"center"} justifyContent={"center"}>

                        <StactBox title={activeUsers?.totalFeedCount} subtitle={"Total Feeds"} progress={activeUsers?.totalFeedCount} increase={"+21%"} icon={<SimCardAlertRounded />} />
 

                    </Box>  
                   
                   <Box gridColumn={"span 8"} gridRow={"span 2"} backgroundColor={green[500]} >
                    <Box mt={"25px"} p={"0 30px"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

                     <Box>
                       <BarChart/> 
                     </Box>
                     <Box>   
                        <IconButton>    
                            <DownloadOutlined sx={{fontSize:"26px",color:"blue"}}/>
                        </IconButton>
                     </Box> 
                    </Box>
 
                    <Box>

                    </Box> 
                   </Box>

                </Box>

            </Box>
            
        </>
    ) 
}

export default Analytics;  