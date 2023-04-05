import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
    SendOutlined,
    DeleteForeverOutlined
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, InputBase, Button, Typography, useTheme } from "@mui/material";
import { color } from "@mui/system";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
  import { setPost } from "state";
  
  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
    date
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);

    const loggedInUserId = useSelector((state) => state.user._id);
    const user = useSelector((state) => state.user);
    

    const navigate = useNavigate()
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main; 
    const primary = palette.primary.main;

    const fullName = `${user?.firstName}  ${user?.lastName}`
  
  
    const patchLike = async () => { //post liking section
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }, 
        
        body: JSON.stringify({ userId: user._id, Username:fullName,  }), 
      });  
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));  //The setPost function is know as reducer.
    };
    

 
    const [comment, setComment] = useState('');
    const handleChange = (event) => {
      setComment(event.target.value);
    };
    

    const patchComment = async () => { //post commenting section
      setComment('');
      if(comment){
        const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }, 
          
          body: JSON.stringify({ userId: loggedInUserId,Username:fullName , comment: comment,userPicture:user.picturePath}), 
        });  
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setComment(null)
      }
     
    };

    const deleteComment = async () =>{
      console.log(postId)
      console.log(user._id)
      const response = await fetch(`http://localhost:3001/posts/${postId}/deleteComment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        }, 
        
        body: JSON.stringify({ userId: user._id, Username:fullName,  }), 
      });  
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost })); 
    }

    return ( 
      <>
      
        <WidgetWrapper m="2rem 0">

        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location} 
          userPicturePath={userPicturePath}
          postId={postId}
        />
        <Typography color={main} sx={{ mt: "1rem " }}>
          {description}
        </Typography>

        <Typography color={main} sx={{ ml: "23rem",mt:"-1.1rem",fontSize:12}}>  
          {date}
        </Typography>

        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
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
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
             <InputBase
        placeholder="Add a comment"
        value={comment}
        onChange={handleChange}
      
      />
      <Button type="submit" color="primary" sx={{ml:"12.5rem"}}
       onClick={patchComment}>
        <SendOutlined />
      </Button>
                      {comments.map((comment, i) => (
                  <Box key={`${name}-${i}`}>
                    <Divider />
                    <Typography sx={{  color: main, m: "0.5rem 0", pl: "1rem" }}>
                         <Box sx={{display:"flex"}}>
                        <img 
                          src={`http://localhost:3001/assets/${comment.userPicture}`} 
                          style={{
                            width: "26px",
                            height: "25px",
                            borderRadius: "50%",
                            marginRight:"5px",
                            objectFit: "cover"
                          }} 
                          alt="profilepic" />
                         <Typography
                           onClick={() => {
                            navigate(`/profile/${comment.userId}`);
                            navigate(0);  
                          }}
                         sx={ {cursor:"pointer", fontSize:15, fontWeight:"semi-bold"}}> {comment.Username} : </Typography>
                        <Typography sx={{ml:"0.5rem", mt:"0.1rem"}}>{comment.comment}</Typography>
                        
                           
                         </Box>
                        
                      
                         {user._id === comment.userId ? <Button type="submit" color="primary" sx={{ml:"21.0rem", mt:"-2.5rem"}}
                          onClick={deleteComment}>
                          <DeleteForeverOutlined />
                        </Button>: null }
                          
                                        
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