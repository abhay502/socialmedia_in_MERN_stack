import AdminNavbar from "Admin/AdminNavbar";
import { USERS_URL } from "Constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';



const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } = require("@mui/material")
const { Typography, Box } = require("@mui/material")
const ENDPOINT = "http://localhost:3001";
var socket

const Usermanagement = () => {

 
  const dispatch = useDispatch();
      

  const token = useSelector((state) => state.adminToken);
  const admin = useSelector((state) => state.admin);

  const [allUsers, setAllUsers] = useState('');    
  const [blockedUserId,setblockedUserId] = useState('');
 
 
  const getAllUsers = async () => {
    try {
      const response = await fetch(`${USERS_URL}/find/getAllUsers`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setAllUsers(data); 
    } catch (error) {
      console.log(error.message);
    }
  }; 
 
  const blockUser = async (userID) => {
    try {
      const response = await fetch(`${USERS_URL}/${userID}/find/blockUser`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json()
      if(response.status === 200){
        console.log(data)
        setblockedUserId(data.userId)
        socket.emit("blockUser",data.userId)
        getAllUsers() 
        
      }
    } catch (error) { 
      console.error(error);    
    }
  }; 
  
 

  useEffect(() => {
    socket = io(ENDPOINT); 
    
    getAllUsers(); 
  }, []); 

  const values = Object.values(allUsers);
  
  return (
    <>
        <AdminNavbar />

      <Box
        gap={"1rem"} 
        width="50%"
        sx={{ mt: "10rem", ml: "21rem", display: "grid" }}
      >
        <Typography variant="h3" fontWeight={"bold"}>   
          List Of All Users
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>MobNumber</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Block</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {values[0] &&
                values[0].map((user, index) => (
                  <TableRow key={user._id}> 
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.number}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell><Button onClick={()=>blockUser(user?._id)}>{user?.isBlocked? "Unblock" : "Block"}</Button></TableCell>

                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Usermanagement;
