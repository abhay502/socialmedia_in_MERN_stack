import AdminNavbar from "Admin/AdminNavbar";
import { USERS_URL } from "Constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import persistStore from "redux-persist/es/persistStore";
import localStorage from "redux-persist/es/storage";
import state, { setLogout, setUserIdNull } from "state";
const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } = require("@mui/material")
const { Typography, Box } = require("@mui/material")

const Usermanagement = () => {
  const dispatch = useDispatch();
  const _id = useSelector((state) => state?.user?._id)

  const token = useSelector((state) => state.adminToken);
  const [allUsers, setAllUsers] = useState('');
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
  
      if (response.ok) {
        // logout user
        
        
          // Dispatch an action to reset the user state to null
          console.log("haii")
          dispatch(setUserIdNull({_id:userID}));
          const local =await  localStorage.getItem('persist:root');
          const parsedValue =await JSON.parse(local);
          console.log(parsedValue?.user);
          // localStorage.removeItem(local.token)
          
        
        
        
        // display alert message
        alert("You have been blocked.");
      } else {
        throw new Error(`Failed to block user: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }; 
  

  useEffect(() => {
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
