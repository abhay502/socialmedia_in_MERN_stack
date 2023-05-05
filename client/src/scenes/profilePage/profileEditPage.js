import { Box, Button, Container, Switch, TextField, Typography } from "@mui/material";
import { USERS_URL } from "Constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { json, useNavigate, useParams } from "react-router-dom";

import Navbar from "scenes/navbar/Navbar";

const ProfileEditPage = () => {
    const navigate = useNavigate()
    const { userId } = useParams();
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null)
    const [profilePic, setProfilePic] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null); 
    const [number, setNumber] = useState(null); 
    const [privateAccount, setPrivateAccount] = useState(false);

    const getUser = async () => {
        const response = await fetch(`${USERS_URL}/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, }
        });
        const data = await response.json();
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setNumber(data.number);
        setPrivateAccount(data.isPrivate)
    }
 
    useEffect(() => {
        getUser() 
    }, []); 
    
    const handleSave = async () => {
        console.log(profilePic)
            const response = await fetch(`${USERS_URL}/${userId}/edit`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json" },
                body:JSON.stringify({firstName:firstName,lastName:lastName,email:email,number:number,profilePic:profilePic?.name,isPrivate:privateAccount}) 
            }).then(()=>{
             navigate('/home')

            }) 
               
       
    };

    const handleFileSelect = (event) => {
        setProfilePic(event.target.files[0]);
    };
    
   
    if (!user) return null;

    return (
        <Box>
            <Navbar />
            <Container sx={{ mt: "5rem" }} maxWidth="sm">
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Edit Profile
                    </Typography>
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
                            <Typography color="red" variant="subtitle1">
                                Tap on Profile Picture to change
                            </Typography>
                            <Box
                                component="img"
                                src={`http://localhost:3001/assets/${user?.picturePath}`}
                                width={150}
                                height={150}
                                borderRadius="50%"
                                marginRight="2rem"
                                onClick={() => document.getElementById("profilePicInput").click()}
                                style={{ cursor: "pointer" }}
                            />
                            <input
                                type="file"
                                id="profilePicInput"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileSelect}
                            />
                            Private Account
                            <Switch
                            checked={privateAccount}
                            onChange={() => setPrivateAccount(!privateAccount)}
                            color="primary"
                            />

                        </Box>
                        <TextField 
                            fullWidth
                            label="FirstName"
                            variant="outlined"
                            margin="normal"
                            defaultValue={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="LastName"
                            variant="outlined"
                            margin="normal"
                            defaultValue={lastName}
                            onChange={(event) => setLastName(event.target.value)}

                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            defaultValue={email}
                            onChange={(event) => setEmail(event.target.value)}

                        />
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            variant="outlined"
                            margin="normal"
                            defaultValue={number}
                            onChange={(event) => setNumber(event.target.value)}

                        />
                        <TextField
                            fullWidth
                            label="Bio"
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                            defaultValue="I am a software developer with 5 years of experience in web development."
                        />
                        <Button
                            variant="contained"


                            color="primary"
                            size="large"
                            onClick={handleSave}
                            sx={{ mt: 3 }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default ProfileEditPage;