import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Typography } from "@mui/material";
import { POSTS_URL } from "Constants";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [noPost,setNoPost] = useState(false)

  const getPosts = async () => { 
    const response = await fetch(POSTS_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if(data.length === 0){
      setNoPost(true)
    }
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${POSTS_URL}/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
   
    if(data.length === 0){
      setNoPost(true)
    }
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts(); 
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
{  !noPost ?   posts?.map(
        ({
          _id,
          userId,
         
          description,
          location,
          picturePath,
          videoPath,
          likes,
          comments,
          createdAt
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
           
            description={description} 
            location={location}
            picturePath={picturePath} 
            videoPath={videoPath}
            likes={likes}
            comments={comments}
            date={ new Date(createdAt).toLocaleString()}
          />
        )
      ):<Typography ml="10rem" sx={{fontSize:40}}>No Posts !</Typography>} 
    </>
  );
};

export default PostsWidget;