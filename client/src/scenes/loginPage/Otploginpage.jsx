import { Box,Typography,useTheme,useMediaQuery, TextField, Button, } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "state";




const Otploginpage = ()=>{
    const theme=useTheme();
    const { palette } = useTheme()
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [email,setEmail] =useState("");
    const [otp,setOtp] = useState("");
    const [responseError,setResponseError] = useState("");
    const [sendTo,setSendTo] = useState('')
    const [pageType,setPageType] = useState('otploginpage')
    const dispatch = useDispatch();


    const handleChange = async (e)=>{
         setEmail(e.target.value);
    }
    const handleChangeOTP = async (e)=>{
        setOtp(e.target.value);
   }
    
    const sendEmail =async ()=>{
        const response = await fetch("http://localhost:3001/auth/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email:email}),
        }); 
        console.log(response)
        const data = await response.json()
        console.log(data)
        if(response.status ===  200){
            setSendTo(data.email)
            setPageType('otpverifypage')
        }else{
            setResponseError("Email does not exist !") 
        }
    }  

    const sendOtp =async ()=>{
        const response = await fetch("http://localhost:3001/auth/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({otp:otp,email:email}),  
        }); 
    
        const data = await response.json()
        
        if(response.status ===  200){
            dispatch(
                setLogin({
                    user: data.user,
                    token: data.token,
                })
            );

            navigate("/home");
        }else if(response.status === 401){
            setResponseError("Sorry you are blocked by admin !🙏") 
        }else{
            setResponseError("Sorry Invalid OTP🙏") 

        }
    }  
    return(  
        <Box>
            <Box width="100%" backgroundColor={theme.palette.background.alt} p="1rem 6%"  textAlign="center">
                
            <Typography fontWeight="bold"
                    fontSize="32px"
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{
                        "&:hover": {
                            
                            cursor: "pointer",

                        },

                    }}
                    
                  >Instagram </Typography>
            </Box>

            <Box width={isNonMobileScreens ? "50%" : "93%"} p="2rem" m="2rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt}>

                <Typography fontWeight="500" variant="h5" sx={{mb:"1.5rem"}}>
                Create an account or log in to Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family. !
                </Typography>

                {sendTo?<Typography color={"green"}>OTP has been send to {sendTo}</Typography>:null}
                {responseError?<Typography color={"red"}>{responseError}</Typography>:null}

                {pageType === 'otploginpage' ?  <Box display={"grid"} gap={"1rem"}>
                <Typography>Enter Email for sending OTP</Typography>
                <TextField label="Email" onChange={handleChange} name="email" sx={{ width:"100%" }} />
                <Button fullWidth  sx={{
                                m: "2rem 0",
                                p: "1rem ",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main }
                            }} onClick={sendEmail}>Confirm</Button>
                </Box>    :


                 <Box display={"grid"} gap={"1rem"}>
                <Typography>Enter your 6-digit  OTP</Typography>
                
                <TextField label="Enter your 6-digit  OTP" onChange={handleChangeOTP} name="otp" sx={{ width:"100%" }} />
                <Button fullWidth  sx={{
                                m: "2rem 0",
                                p: "1rem ",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main }
                            }} onClick={sendOtp}>Confirm</Button>
                </Box> }
                
               
               
            </Box> 

             
        </Box>
    )
}

export default Otploginpage;