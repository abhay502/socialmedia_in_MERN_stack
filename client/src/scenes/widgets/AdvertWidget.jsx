import { Typography,useMediaQuery,useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";


const AdvertWidget = ()=>{
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;


    return(
       
        <WidgetWrapper position={isNonMobileScreens ? "fixed" : undefined} width="25%"   >
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Sponsored
                </Typography>
                <Typography color={medium} >
                    Create Add
                </Typography>
            </FlexBetween>
            <img width="100%" height="auto" alt="Advert" scr={"http://localhost:3001/assets/info3.jpeg" }
             style={{ borderRadius:"0.75rem", margin:"0.75rem 0"}}
             />
             <FlexBetween>

                <Typography color={main} >MikaCosmetics</Typography>
                <Typography color={medium} >mikacosmetics.com</Typography>

             </FlexBetween>

             <Typography color={medium} m="0.5rem 0">
                Your pathway to stunning and immaculate  beauty and made your skin expoliating and more brighter... 
             </Typography>


        </WidgetWrapper>
    )
}

export default AdvertWidget;