import { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    picture: yup.string().required("required"),
})

const OtpLoginSchema = yup.object().shape({
    number: yup
    .number()
    .typeError("must be a number")
    .required("required")
    .min(10, "must be at least 10 digits")
})

const OtpVerificationSchema = yup.object().shape({
    number: yup.number().required("required")
})




const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required")  
})

const initialValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    picture: '',
    number:''
}

const initialValuesLogin = {
    email: '',
    password: ''
}

const initialValuesOtp = {
    number:''
}
const initialVerifyOTP = {
    otp:''
}
const Form = () => {
    //page-types
    const [pageType, setPageType] = useState("login")
    const isLogin = pageType === "login";
    const isRegister = pageType === "register"
    const isOTPNumberPage = pageType === "OTPNumberPage"
    const isOTPVerifyPage = pageType === "OTPVerifyPage"


    const { palette } = useTheme()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    


    const [OTPSendNum,setOTPSendNum] = useState(null)
    const [numberNotExist,setnumberNotExist] = useState(null)


    const register = async (values, onSubmitProps) => {
        //this allows us to send form info with images
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name)

        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData,
            }
        )
        const savedUser = await savedUserResponse.json()
        onSubmitProps.resetForm()

        if (savedUser) {
            setPageType("login")

        }
    }


    const [userNot, setUserNot] = useState(null);

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (loggedInResponse.status === 400) {
            setUserNot("Email or Password Incorrect ! Please Try Again 🙏")

        } else {
            const loggedIn = await loggedInResponse.json();
            onSubmitProps.resetForm();

            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );

            navigate("/home");
        }

    };

    const OtpLogin = async (values, onSubmitProps)=> {
        console.log("Krishhhh"+values)
        const OtpResponse = await fetch("http://localhost:3001/mobilenumber/phone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        
        onSubmitProps.resetForm() 
        
        if(OtpResponse.status === 200){

            const response = await OtpResponse.json()

       
           setOTPSendNum(response)
           setPageType("OTPVerifyPage")
           
        
       
        }else if (OtpResponse.status === 400){
            const response = "Sorry Number doesn't exist !"

            setnumberNotExist(response)

        }
        

        
    }

    const verifyOTP = async (values, onSubmitProps)=>{
      console.log("yoyoyoyoyoy"+values)
        // const verifyOTPResponse = await fetch("http://localhost:3001/mobilenumber/otp", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(values),
        // });

        onSubmitProps.resetForm() 
    }

    useEffect(() => {
        
    }, [userNot]);

   useEffect(()=>{
   
   },[OTPSendNum])

   useEffect(()=>{
    
   },[numberNotExist])


    const handleFormSubmit = async (values, onSubmitProps) => {

        
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
        if (isOTPNumberPage) await OtpLogin({ number: values.number },onSubmitProps)   
        if (isOTPVerifyPage) await  verifyOTP({ number: values.number },onSubmitProps)


    } 
    console.log(pageType)
    
    return (
        <Formik onSubmit={handleFormSubmit} initialValues={isLogin ? initialValuesLogin : isOTPNumberPage ? initialValuesOtp : isOTPVerifyPage ? initialVerifyOTP : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : isOTPNumberPage ? OtpLoginSchema : isOTPVerifyPage ? OtpVerificationSchema : registerSchema}>
            {({
                values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Typography color="error" sx={{ mb: "1.5rem" }}  >
                        {userNot}
                    </Typography>
                    <Typography variant="h3" sx={{ mb: "1.5rem" }}>
                        {isLogin ? "Login Page ⚙️" : isOTPNumberPage && !isOTPVerifyPage ? "OTP Login Page" : isOTPVerifyPage ? "Please enter OTP" : "Sign Up Page ⚙️"}
                    </Typography>
                     
                    {isOTPNumberPage  ?  
                     <>  
                     <TextField
                        label="Phone Numberrrr" 
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.number}
                        name="number"
                        error={Boolean(touched.number) && Boolean(errors.number)}
                        helperText={touched.number && errors.number}
                        sx={{display:"flex", m:"2rem 0"}} 

                        />   


                        {numberNotExist ? <Typography color="red">{numberNotExist}</Typography> : null}

                        
                        </>       
                        
                        : isOTPVerifyPage ?
                       <>  
                       
                       <TextField
                        label="Enter OTP"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.otp}
                        name="otp"
                        error={Boolean(touched.number) && Boolean(errors.number)}
                        helperText={touched.number && errors.number}
                        sx={{ gridColumn: "span 4" }} 
                        /> 
                        {OTPSendNum ? <Typography color="greenyellow">OTP has been send to - {OTPSendNum}</Typography> : null}
                        </>       :
                        
                        
                        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4,minmax(0,1fr))"
                            sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}>

                      


                        {isRegister && (
                            <>
  


                                <TextField label="First Name" onBlur={handleBlur}
                                    onChange={handleChange} value={values.firstName}
                                    name="firstName" error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName} sx={{ gridColumn: "span 2" }} />

                                <TextField label="Last Name" onBlur={handleBlur}
                                    onChange={handleChange} value={values.lastName}
                                    name="lastName" error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName} sx={{ gridColumn: "span 2" }} />

                                <TextField label="Location" onBlur={handleBlur}
                                    onChange={handleChange} value={values.location}
                                    name="location" error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location} sx={{ gridColumn: "span 4" }} />


                                <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px" p="1rem">

                                    <Dropzone acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) => {
                                            setFieldValue("picture", acceptedFiles[0])
                                        }}>
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem" sx={{ "&:hover": { cursor: "pointer" } }}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.picture ? (
                                                    <p>Add Picture here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>{values.picture.name}</Typography>
                                                        <EditOutlinedIcon />
                                                    </FlexBetween>
                                                )}

                                            </Box>
                                        )}
                                    </Dropzone>

                                </Box>

                                <TextField label="Phone Number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.number}
                                    name="number"
                                    error={Boolean(touched.number) && Boolean(errors.number)}
                                    helperText={touched.number && errors.number} sx={{ gridColumn: "span 4" }} />

                            </>
                        )}



                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }} />




                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }} /> 
                      
                       
                        
                       

                    </Box>
                    }
                    <Box>
                        
                        
                      {isLogin || isRegister ?  <Button
                            fullWidth
                            type="submit"
                           
                            sx={{
                                m: "2rem 0",
                                p: "1rem ",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main }
                            }}
                        >
                            {isLogin ? "LOGIN"  : "REGISTER" }
                        </Button> : null }

                       {isLogin ?  
                       <Button
                            fullWidth
                             type="button"
                            onClick={() => {
                                setPageType(isLogin ? "OTPNumberPage" : "OTPVerifyPage");
                            }}
                            sx={{
                                m: "2rem 0",
                                p: "1rem ",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main }
                            }}
                        >
                            {isLogin ? "LOGIN WITH OTP"  : "abhay"}
                        </Button> 
                        : isOTPNumberPage || isOTPVerifyPage ? <Button
                            fullWidth
                            type="submit"
                             
                            sx={{
                                m: "2rem 0",
                                p: "1rem ",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main }
                            }}
                        >
                            {isOTPNumberPage ? "SEND OTP"  : "VERIFY OTP"}
                        </Button> :   null
                        }
                        
                        
                      

                        
                    </Box>


                    <Box>
                       
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline", color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light
                                }
                            }}
                        >
                            {isLogin ? "Don't have an account? Sign Up here" : "Already have an account? Login here"}
                        </Typography>
                        
                    </Box>
                </form>
            )}

        </Formik>
    )
}
export default Form;