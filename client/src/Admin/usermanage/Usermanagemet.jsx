import { Search } from "@mui/icons-material";
import AdminNavbar from "Admin/AdminNavbar";
import { USERS_URL } from "Constants";
import FlexBetween from "components/FlexBetween";
import { useCallback, useEffect, useState } from "react";
import {useSelector } from "react-redux";
import io from 'socket.io-client';



const { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Badge, TableSortLabel, FormControlLabel, Switch, InputBase, IconButton } = require("@mui/material")
const { Typography, Box } = require("@mui/material")
const ENDPOINT = "http://localhost:3001";
var socket

const Usermanagement = () => {


  


  const token = useSelector((state) => state.adminToken);


  const [allUsers, setAllUsers] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [showActive, setShowActive] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [searchedResults, setSearchedResults] = useState("")

  const getAllUsers = useCallback(async () => {
    try {
      const response = await fetch(`${USERS_URL}/find/getAllUsers`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      console.log(data)
      setAllUsers(data);
    } catch (error) {
      console.log(error.message); 
    }
  }, [token]);
  const blockUser = async (userID) => {
    try {
      const response = await fetch(`${USERS_URL}/${userID}/find/blockUser`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json()
      if (response.status === 200) {
        console.log(data)

        socket.emit("blockUser", data.userId)
        getAllUsers()

      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchUsers = async () => {
    
    try {
      const response = await fetch(`${USERS_URL}/searchUserAdmin/${searchKey}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if(response.status === 200){
        const data = await response.json();
       
         setSearchedResults(data);
      } 
                 
     
      
    } catch (error) {
      console.log(error.message);
    }

  };



  useEffect(() => {
    socket = io(ENDPOINT);

    getAllUsers();
  }, [getAllUsers]);
  let values;
  let searchByOnly;
  if(searchedResults.length>1){
    searchByOnly = searchedResults; 
  }else{ 
   values = Object.values(allUsers);

  } 
 
  const handleSort = (column) => {
    if (orderBy === column && order === 'asc') {
      setOrder('desc');
    } else {
      setOrder('asc'); 
      setOrderBy(column); 
    }
  };
  console.log(searchByOnly)
  const filteredUsers = showActive ? searchByOnly ? searchByOnly?.filter(user => !user.isBlocked) :  values[0]?.filter(user => !user.isBlocked) : values[0];
 
 
  const sortedUsers = filteredUsers?.sort((a, b) => {
    if (order === 'asc') {  
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });



  return (
    <>
      <AdminNavbar />

      <Box gap={"1rem"} width="95%" sx={{ mt: "6rem", ml: "2rem", display: "grid" }} >
        <Typography variant="h3" fontWeight={"bold"}>
          List Of All Users
        </Typography>  
        <TableContainer component={Paper}>
          <FormControlLabel sx={{ ml: '1rem' }}
            control={<Switch checked={showActive} onChange={(e) => setShowActive(e.target.checked)} />}
            label="Show Active "
          />
          <FlexBetween backgroundColor={"grey"} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem" ml={"1rem"} width={"20rem"}>
            <InputBase placeholder="Search....." onChange={(e) => { setSearchKey(e.target.value) 
              searchUsers() }} value={searchKey} /> 
            <IconButton>
              <Search />

            </IconButton>


          </FlexBetween>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1rem', fontFamily: 'fantasy' }}>#</TableCell>
                <TableCell sx={{ fontSize: '1rem', fontFamily: '' }}>
                  <TableSortLabel
                    active={orderBy === 'firstName'}
                    direction={order}
                    onClick={() => handleSort('firstName')}
                  >
                    User Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Email Address</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>MobNumber</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Location</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers?.map((user, index) => (
                <TableRow key={user._id}  sx={{ '&:hover': { backgroundColor: 'grey' } }}>
                  <TableCell sx={{ fontSize: '1rem' }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: '1rem' }}>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell sx={{ fontSize: '1rem' }}>{user.email}</TableCell>
                  <TableCell sx={{ fontSize: '1rem' }}>{user.number}</TableCell>
                  <TableCell sx={{ fontSize: '1rem' }}>{user.location}</TableCell>
                  <TableCell>
                    <Badge
                      badgeContent={user.isBlocked ? 'Not active' : 'Active'}
                      color={user.isBlocked ? 'error' : 'success'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => blockUser(user._id)}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
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
