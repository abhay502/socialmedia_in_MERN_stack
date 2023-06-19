import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  ReportOutlined,
  SendOutlined,
  DeleteForeverOutlined,

} from "@mui/icons-material";

import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Divider, IconButton, InputBase, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,  NativeSelect, Tooltip } from "@mui/material";

import { IMG_URL, POSTS_URL } from "Constants";
import CommentList from "components/CommentList";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import { formatDistanceToNow } from 'date-fns';
import WidgetWrapper from "components/WidgetWrapper"; 
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,

  description,
  location,
  picturePath,
  videoPath,

  likes, 
  comments,
  date
}) => {

  const postDate = new Date(date);
  const formattedDate = formatDistanceToNow(postDate, { addSuffix: true });
  const [isComments, setIsComments] = useState(false);
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const handleClickOpen = () => {
    setOpenReport(true);
  };
  const handleClose = () => {
    setOpenReport(false);

  }

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const loggedInUserId = useSelector((state) => state.user._id);
  const user = useSelector((state) => state.user);


   
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const fullName = `${user?.firstName}  ${user?.lastName}`

  const likesArray = Object.entries(likes).map(([id, value]) => ({ _id: id, value }));


  const patchLike = async () => { //post liking section
    const response = await fetch(`${POSTS_URL}/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userId: user._id, Username: fullName, }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));  //The setPost function is know as reducer.
  };



  const [comment, setComment] = useState('');
  const [reportReason, setReportReason] = useState('');

  const handleChange = (event) => {
    setComment(event.target.value);
  };
  const handleChangeReport =(event)=>{
    setReportReason(event.target.value)
  }

  const sendReport = async () =>{
    handleClose()
    setReportReason('')

    if(reportReason){
      const response = await fetch(`${POSTS_URL}/${postId}/report`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportReason: reportReason, userId: user._id, }),
      }); 
      console.log(response);

    }else{
      alert('Select any reason otherwise post will not reported')
    }
   

  }


  const patchComment = async () => {
    setComment(""); //post commenting section
    if (comment && comment.trim()) { // Check that comment is not empty or only whitespace
      setComment(comment.trim()); // Update comment state to remove whitespace
      const response = await fetch(`${POSTS_URL}/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, Username: fullName, comment: comment.trim(), userPicture: user.picturePath }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      // Reset comment state
    }
  };


  const deleteComment = async () => {

    const response = await fetch(`${POSTS_URL}/${postId}/deleteComment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userId: user._id, Username: fullName, }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  }
  const [showLove, setShowLove] = useState(false);

  const handleDoubleClick = () => {
    patchLike();
    setShowLove(true);
    setTimeout(() => {
      setShowLove(false);
    }, 1000);
  }


  return (
    <>

      <WidgetWrapper m="2rem 0">

        <Friend 
          friendId={postUserId}
          name={postUserId}
          subtitle={location}
          userPicturePath={postUserId}
          postId={postId}
        />


        <Typography color={main} sx={{ ml: "23rem", fontSize: 12 }}>
          Posted On :{formattedDate}
        </Typography>

        {picturePath && ( 
          <div style={{ position: "relative" }}>
            {showLove && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "red",
                fontSize: "2rem",
                zIndex: 1,
              }}>
                <FavoriteIcon sx={{ fontSize: '6rem' }} />
              </div>
            )}
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem", cursor: "pointer" }}
              src={IMG_URL + picturePath}
              onDoubleClick={handleDoubleClick}
            />
          </div>
        )}
       
      {videoPath && (
          <div style={{ position: "relative" }}>
            {showLove && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "red",
                fontSize: "2rem",
                zIndex: 1,
              }}>
                <FavoriteIcon sx={{ fontSize: '6rem' }} />
              </div>
            )}
            <video
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem", cursor: "pointer" }}
              src={`http://localhost:3001/assets/${videoPath}`}
              onDoubleClick={handleDoubleClick}
              controls // Add this attribute to display video controls
            />
          </div>
        )}
        <Dialog
          open={openReport}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Why are you reporting  this post?"}
          </DialogTitle>
          <NativeSelect 
           defaultValue={'DEFAULT'} 
           name="dailyinput" 
           onChange={e =>handleChangeReport(e)} 
           id="select"
         >
           <option value="DEFAULT" disabled>Select reason for reporting this post..</option>
           <option value="I just don't like this">I just don't like this</option>
           <option value="It's a spam">It's a spam</option>
           <option value="Nudity or sexual activity">Nudity or sexual activity</option>
           <option value="False information">False information</option>

         </NativeSelect>
           

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={sendReport} autoFocus>
              Report
            </Button>
          </DialogActions> 
        </Dialog>


        <Typography fontWeight="500" color={main} sx={{ mt: "1rem ", }}>
          {description}
        </Typography>
        <FlexBetween mt="0.25rem">

          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography onClick={() => setOpen(true)} sx={{ fontWeight: '500', cursor: 'pointer' }} >{likeCount} likes</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <Tooltip title="Add a comment">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              </Tooltip>
             
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Liked by ❤️</DialogTitle>
            {likesArray.map((like, i) => (
              <DialogContent key={i}><CommentList userId={like?._id} /></DialogContent>
            ))}
          </Dialog>

          <Box gap={'1rem'}>
            <Tooltip title="Share post">
            <IconButton >
              <ShareOutlined />
            </IconButton>
            </Tooltip>
           
            <Tooltip title="Report post">
              <IconButton onClick={handleClickOpen}>
                <ReportOutlined />
              </IconButton>
            </Tooltip>
          </Box>


        </FlexBetween> 
        {isComments && (
          <Box mt="0.5rem">
            <InputBase
              placeholder="Add a comment"
              value={comment}
              onChange={handleChange}

            />
            <Button type="submit" color="primary" sx={{ ml: "12.5rem" }}
              onClick={patchComment}>
              <SendOutlined />
            </Button>
            {comments.map((comment, i) => (
              <Box key={`${comment.userId}-${i}`}>

                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  <Box sx={{ display: "flex" }}>
                    <Box height='2rem'>
                      {comment.userId &&
                        <CommentList userId={comment.userId} />}
                    </Box>


                    <Typography width={"13rem"} sx={{ ml: "0.5rem", mt: "0.4rem", fontSize: "0.9rem" }}> - {comment.comment}</Typography>


                  </Box>


                  {user._id === comment.userId ? <Button type="submit" color="primary" sx={{ ml: "21.0rem", mt: "-2.5rem" }}
                    onClick={deleteComment}>
                    <DeleteForeverOutlined />
                  </Button> : null}


                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>

    </>
  );
};

export default PostWidget; 
