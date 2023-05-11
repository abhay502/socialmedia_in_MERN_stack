import AdminNavbar from "Admin/AdminNavbar";
import { USERS_URL } from "Constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';

const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Badge } = require("@mui/material")
const { Typography, Box } = require("@mui/material")
const ENDPOINT = "http://localhost:3001";
var socket

const Usermanagement = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.adminToken);
  const [allUsers, setAllUsers] = useState('');    
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedValues = values[0] && values[0].slice().sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <>
        <AdminNavbar />

        <Box gap={"1rem"} width="95%" sx={{ mt: "6rem", ml: "2rem", display: "grid" }}>
            <Typography variant="h3" fontWeight={"bold"}>
                List Of All Users
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Typography sx={{ mr: "1rem" }}>Sort by:</Typography>
                <Button variant="outlined" size="small" sx={{ mr: "0.5rem" }} onClick={() => sortByName()}>
                    Name
                </Button>
                <Button variant="outlined" size="small" onClick={() => sortByStatus()}>
                    Status
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: "1rem", fontFamily: "fantasy" }}>#</TableCell>
                            <TableCell sx={{ fontSize: "1rem", fontFamily: "revert" }}>User Name</TableCell>
                            <TableCell  sx={{fontSize:"1rem"}} onClick={() => requestSort("email")}>Email Address</TableCell>
                <TableCell  sx={{fontSize:"1rem"}} onClick={() => requestSort("number")}>MobNumber</TableCell>
                <TableCell  sx={{fontSize:"1rem"}} onClick={() => requestSort("location")}>Location</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>Status</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values[0] &&
                            values[0].map((user, index) => (
                                <TableRow key={user._id}>
                                    <TableCell sx={{ fontSize: "1rem" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ fontSize: "1rem" }}>{`${user.firstName} ${user.lastName}`}</TableCell>
                                    <TableCell sx={{ fontSize: "1rem" }}>{user.email}</TableCell>
                                    <TableCell sx={{ fontSize: "1rem" }}>{user.number}</TableCell>
                                    <TableCell sx={{ fontSize: "1rem" }}>{user.location}</TableCell>
                                    <TableCell>
                                        <Badge
                                            badgeContent={user.isBlocked ? "Not active" : "Active"}
                                            color={user.isBlocked ? "error" : "success"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => blockUser(user?._id)}>
                                            {user?.isBlocked ? "Unblock" : "Block"}
                                        </Button>
                                    </TableCell>
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
