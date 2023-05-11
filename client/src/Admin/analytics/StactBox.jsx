import { Box, Typography, colors } from "@mui/material";
import ProgressCircle from "./ProgressCircle";

const StactBox = ({title,subtitle,icon,progress,increase})=>{
    return(
        <Box width={"100%"} m={"0 30px"}>   
            <Box display={"flex"} justifyContent={"space-between"}>
                <Box>
                    {icon}
                    <Typography variant="h4" fontWeight={"bold"}>{title} </Typography>
                </Box>
                <Box>
                    <ProgressCircle progress={progress} />

                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="h5" >{subtitle} </Typography>
                <Typography variant="h5" fontStyle={"italic"} color={colors.green[600]}>{increase} </Typography>

                    
                </Box>
            </Box>
        </Box>
    )
}

export default StactBox;