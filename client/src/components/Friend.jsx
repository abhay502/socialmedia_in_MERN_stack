import { PersonAddOutlined, PersonRemoveOutlined, MoreVertRounded ,DeleteForeverRounded,EditRounded } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme,MenuItem,Menu,Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useEffect, useState } from "react";
import { setPost } from "state";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';
import EditPostWidget from "scenes/widgets/EditPostWidget";
import { POSTS_URL, USERS_URL } from "Constants";


  
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Friend = ({ friendId, name, subtitle, userPicturePath ,postId}) => {
  const getUser = async () => {

    const response = await fetch(`${USERS_URL}/${friendId}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })

    const data = await response.json();
    setUser(data);
}

useEffect(() => {
    getUser()
}, []);
  const [open, setOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
 
 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {  
    setOpen(false);
    setAnchorEl(null);
  }
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(null)
   
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const friends = useSelector((state) => state.user.friends);
  const friendsArray = Object.values(friends);
  
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friendsArray.find((friend) => friend._id === friendId);

  
  const deletePost = async() => { //code to delete a post
    setAnchorEl(null);
    handleClose()
    console.log(postId)
    const response = await fetch(`${POSTS_URL}/${postId}/deletePost`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",  
      }, 
    }); 
    // console.log(response) 
    const updatedPost = await response.json();
    console.log(updatedPost)
    dispatch(setPost({ post: updatedPost })); 
    
  };
  const patchFriend = async () => {
    const response = await fetch(
      `${USERS_URL}/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };
  if(!user) return null
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={user?.picturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {user?.firstName+ " "+user?.lastName}
          </Typography> 
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {_id !== friendId ? <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton> : <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertRounded />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClickOpen}><DeleteForeverRounded />Delete Post</MenuItem>
        <MenuItem onClick={handleModalOpen}><EditRounded />Edit Post</MenuItem>
        {/* <MenuItem onClick={handleClose}>Option 3</MenuItem> */}
      </Menu>
      </>}
      <Modal
        open={modalOpen}
        onClose={handleModalClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
         <EditPostWidget postId={postId} />
        </Box>
      </Modal>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure want to delete this post?"}
        </DialogTitle>
       
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={deletePost} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </FlexBetween>
  );
};

export default Friend;