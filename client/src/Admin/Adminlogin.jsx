import { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminLogin, setLogin } from "state";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";



const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required")
})


const initialValuesLogin = { email: '',  password: ''}


const AdminLoginPage = () => {
    const { palette } = useTheme()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [userNot, setUserNot] = useState(null);

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch("http://localhost:3001/auth/adminLogin", {
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
                setAdminLogin({
                    admin: loggedIn.user,
                    adminToken: loggedIn.token,
                })
            );

            navigate("/Adminhome");
        }

    };

    const handleFormSubmit = async (values, onSubmitProps) => {


       login(values, onSubmitProps);



    }
    useEffect(() => { 
        
    }, [userNot]);

    

    return (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          border:'1px solid white'
        }}
      >
        <Typography color="error" sx={{ mb: '1.5rem' }}>
          {userNot}
        </Typography>
        <Typography variant="h3" sx={{ mb: '1.5rem' }}>
          {'Admin Login Page ⚙️'}
        </Typography>
    
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesLogin}
          validationSchema={loginSchema}
        > 
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                
                <Box display={"grid"}>
                <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mb: '1rem' }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ mb: '1rem' }}
              />
                </Box>
             
    
              <Button
                fullWidth
                type="submit"
                sx={{
                  mt: '1rem',
                  p: '1rem',
                  backgroundColor: 'primary.main',
                  color: 'background.alt',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                LOGIN
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    )
}
export default AdminLoginPage;