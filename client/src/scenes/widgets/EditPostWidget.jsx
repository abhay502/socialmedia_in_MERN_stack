
import { useTheme } from "@emotion/react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import { IMG_URL, POSTS_URL } from "Constants";

import WidgetWrapper from "components/WidgetWrapper";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EditPostWidget = ({ postId }) => { 
 
    const navigate=useNavigate()
    
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
 
    const [post,setPost] = useState(null);
    const [updatePost,setUpdatePost] = useState('');
    
    const getPostToEdit = useCallback(async () => {
        const response = await fetch(`${POSTS_URL}/${postId}/getPostToEdit`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
    
        const data = await response.json();
        setPost(data);
        setUpdatePost(data);
    }, [postId, token]);

    useEffect(()=>{
        getPostToEdit()
    },[getPostToEdit])
    
    
    //  const  date=new Date(post?.createdAt).toLocaleString()


    const  submitEditPost =async ()=>{
       navigate('/home')
        const response = await fetch(`${POSTS_URL}/${postId}/submitEditPost`,{
            method:"PATCH",
            headers: { Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
        body: JSON.stringify({ description:updatePost}), 

        })

        console.log(response)
    } 
    const  handleButtonClick = ()=> {
        submitEditPost();
    
      }
     
    return (

        <WidgetWrapper>
             
           <Typography sx={{ml:"12rem"}}>EDIT POST </Typography>
           <Box display="grid" gap="0.5rem">
            
                

                <Typography variant="h5">Image:</Typography> 
                      <Typography color={"red"}>Image can't be edit </Typography>
                           
                {post?.picturePath && (
                            <img
                                width="50%" 
                                height="auto"
                                alt="post"
                                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                                src={IMG_URL+post?.picturePath} 
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