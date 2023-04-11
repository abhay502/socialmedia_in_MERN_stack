import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendOutlined,
  DeleteForeverOutlined,

} from "@mui/icons-material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Divider, IconButton, InputBase, Button, Typography, useTheme } from "@mui/material";
import { IMG_URL, POSTS_URL } from "Constants";

import CommentList from "components/CommentList";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";

import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const handleChange = (event) => {
    setComment(event.target.value);
  };


  const patchComment = async () => { //post commenting section
    setComment('');
    if (comment) {
      const response = await fetch(`${POSTS_URL}/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ userId: loggedInUserId, Username: fullName, comment: comment, userPicture: user.picturePath }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setComment(null)
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
          Posted On :{date}
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
              <Typography sx={{ fontWeight: '500' }}>{likeCount} likes</Typography>
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


                    <Typography width={"13rem"} sx={{ ml: "0.5rem", mt: "0.4rem", fontSize: "0.9rem" }}>{comment.comment}</Typography>


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