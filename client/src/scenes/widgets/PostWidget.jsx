import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
    SendOutlined
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
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);

    const loggedInUserId = useSelector((state) => state.user._id);
    const user = useSelector((state) => state.user);
    
    // console.log(UserpicturePath.picturePath +"picture")

    const navigate = useNavigate()
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main; 
    const primary = palette.primary.main;

    const fullName = `${user?.firstName}  ${user?.lastName}`
  
    console.log(fullName)
  
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
    };

    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location} 
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
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
                          <UserImage picturePath={comment.userPicture}/>
                         <Typography
                           onClick={() => {
                            navigate(`/profile/${comment.userId}`);
                            navigate(0);  
                          }}
                         sx={ {cursor:"pointer", fontSize:15, fontWeight:"semi-bold"}}> {comment.Username} : </Typography>
                        <Typography sx={{ml:"0.5rem"}}>{comment.comment}</Typography>
                         </Box>
                        
                      
                    
                      
                                        
                    </Typography>
                  </Box>
                ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default PostWidget;