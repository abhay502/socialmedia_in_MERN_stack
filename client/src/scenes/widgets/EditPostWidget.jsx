
import { useTheme } from "@emotion/react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, useNavigate } from "react-router-dom";

const EditPostWidget = ({ postId }) => {
 
    const navigate=useNavigate()
    
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();

    const [post,setPost] = useState(null);
    const [updatePost,setUpdatePost] = useState('');
    const getPostToEdit = async ()=>{
        const response = await fetch(`http://localhost:3001/posts/${postId}/getPostToEdit`,{
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json();
        //  console.log(data)
          setPost(data)
          setUpdatePost(data)
             
    }

    useEffect(()=>{
        getPostToEdit()
    },[])
    
    
     const  date=new Date(post?.createdAt).toLocaleString()

    const  submitEditPost =async ()=>{
       navigate('/home')
        const response = await fetch(`http://localhost:3001/posts/${postId}/submitEditPost`,{
            method:"PATCH",
            headers: { Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
        body: JSON.stringify({ description:updatePost}), 

        })

        const data = await response.json();
    } 
    const  handleButtonClick = ()=> {
        submitEditPost();
    
      }
     
    return (

        <WidgetWrapper>
             
           <Typography sx={{ml:"12rem"}}>EDIT POST </Typography>
           <Box display="grid" gap="0.5rem">
           
                <UserImage image={post?.userPicturePath} />
                    <Typography>{post?.firstName+""+post?.lastName}</Typography>
                    <Typography>createdAt : {date}</Typography>

                <Typography variant="h5">Image:</Typography>
                      <Typography color={"red"}>Image can't be edit</Typography>
                           
                {post?.picturePath && (
                            <img
                                width="50%"
                                height="auto"
                                alt="post"
                                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                                src={`http://localhost:3001/assets/${post?.picturePath}`} 
                            />
                        )}  
                    <Typography variant="h5">Description:</Typography>
                   
                <InputBase
                    placeholder="Description..."
                    onChange={(e) => setUpdatePost(e.target.value)}
                    value={updatePost?.description}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem"
                    }}
                /> 

<Button onClick={() => { handleButtonClick(); navigate('/'); }} sx={{m:"1rem", border:"1px solid"}}>Save</Button>
            

            </Box> 
 
        </WidgetWrapper>
    )
}
 
export default EditPostWidget;