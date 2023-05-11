import {  ArrowDownwardOutlined, ArrowUpwardOutlined, ChatBubbleOutlineOutlined, FavoriteBorderOutlined } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import AdminNavbar from "Admin/AdminNavbar";
import { IMG_URL, POSTS_URL } from "Constants";
import CommentList from "components/CommentList";
import FlexBetween from "components/FlexBetween"; 
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";


const Postmanagement = () => {
  const token = useSelector((state) => state.adminToken);
  const [reportedPosts, setReportedPosts] = useState("");
  const [modal, setModal] = useState(false)
  const [modalPost, setModalPost] = useState("");
  const [sortBy, setSortBy] = useState("desc");



  const getAllReportedPosts = useCallback(async (sortOrder) => {
    try {
      const response = await fetch(
        `${POSTS_URL}/find/getAllReportedPosts?sort=${sortOrder}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      setReportedPosts(data);
    } catch (error) {
      console.log(error.message);
    }
  }, [setReportedPosts, token]);  
  
useEffect(() => {
    getAllReportedPosts(sortBy);
}, [getAllReportedPosts, sortBy]);

   

  const fetchThatPost = async (postId) => {

    try {
      const response = await fetch(`${POSTS_URL}/find/${postId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log(data)
      setModalPost(data)
      setModal(true)
    } catch (error) {
      console.log(error.message);

    }
  }

  const removeThatPost = async (postId) =>{
    try {
      console.log(postId)
      const response = await fetch(`${POSTS_URL}/${postId}/deletePost`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",  
        }, 
      }); 
      if(response.status === 200){
       getAllReportedPosts()

      }

    } catch (error) {
      
    }
  }

  useEffect(() => {
    getAllReportedPosts(sortBy);
  }, [getAllReportedPosts, sortBy]);
  

  const handleSort = () => {
    if (sortBy === "asc") {
      setSortBy("desc");
    } else {
      setSortBy("asc"); 
    }
  };

  
  if (modalPost[0]) {
    var likeCount = Object.keys(modalPost[0]?.post[0]?.likes).length;

  }
  
  return ( 
    <>
      <AdminNavbar />

      <Box gap={"1rem"} width="95%" sx={{ mt: "7rem", ml: "2rem", display: "grid" }}>
        <Typography variant="h3" fontWeight={"bold"}>
          List Of Reported Posts
        </Typography>
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
  <TableRow>
    <TableCell>#</TableCell>
    <TableCell>Post </TableCell>
    <TableCell>Reported User</TableCell>
    <TableCell>Reported Reason</TableCell>
    <TableCell>
      Reported Date{" "}
      <IconButton
        onClick={() =>{
          handleSort()
           
        }
        }
      >
        {sortBy === "asc" ? <ArrowDownwardOutlined /> : <ArrowUpwardOutlined />}
      </IconButton>
    </TableCell> 
    <TableCell>Action</TableCell>
  </TableRow>
</TableHead>
            <TableBody>
              {reportedPosts &&
                reportedPosts.map((reportedpost, index) => (


                  <TableRow key={reportedpost._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell >
                      
                       <img src={IMG_URL + reportedpost?.post?.picturePath}
                      style={{ width: '10rem', height:"7rem", borderRadius: "2rem", cursor: 'pointer' }} alt={"description"}
                      onClick={() => {
                        fetchThatPost(reportedpost.post._id)
                      }} />
                       
                      
                      </TableCell>
                    <TableCell>{reportedpost.reportedUser.firstName + " " + reportedpost.reportedUser.lastName}</TableCell>
                    <TableCell>{reportedpost.reportReason}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(reportedpost.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell><Button onClick={()=>removeThatPost(reportedpost.post._id)}>Remove Post</Button></TableCell>

                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {modal ? <Modal open={modal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >

            <Box sx={{ display:"grid" }}>
              <WidgetWrapper >
              <Typography variant="h3" align="center" color={"red"}>Reported Post</Typography>

              <Box display={"flex"} gap={"0.7rem"}>
                <UserImage image={modalPost[0]?.postedUser[0]?.picturePath} />
              <Typography sx={{mt:'0.7rem', fontSize: 15 }}>
                  {modalPost[0]?.postedUser[0]?.firstName+" "+modalPost[0]?.postedUser[0]?.lastName}
                </Typography>
              </Box>
             

  
                <Typography sx={{ ml: "23rem", fontSize: 12 }}>
                  Posted On : 
                </Typography>
 
                {modalPost[0]?.post[0]?.picturePath && (
                  <div style={{ position: "relative" }}>

                    <img
                      width="320rem"
                      height="230rem" 
                      alt="post" 
                      style={{marginLeft:'3rem', borderRadius: "0.75rem", marginTop: "0.75rem", cursor: "pointer" }}
                      src={IMG_URL + modalPost[0]?.post[0]?.picturePath}

                    />
                  </div>
                )}
                {modalPost[0]?.post[0]?.videoPath && (
                  <div style={{ position: "relative" }}>

                    <video
                      width="100%"
                      height="auto"
                      alt="post"
                      style={{ borderRadius: "0.75rem", marginTop: "0.75rem", cursor: "pointer" }}
                      src={`http://localhost:3001/assets/${modalPost[0]?.post[0]?.videoPath}`}

                      controls // Add this attribute to display video controls
                    />
                  </div>
                )}



                <Typography fontWeight="500" sx={{ mt: "1rem ", }}>
                  {modalPost[0]?.post[0]?.description}
                </Typography>
                <FlexBetween mt="0.25rem">

                  <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                      <IconButton >
                        {modalPost[0]?.post[0]?.isLiked ? (
                          <FavoriteBorderOutlined sx={{ color: "blue" }} />
                        ) : (
                          <FavoriteBorderOutlined />
                        )}
                      </IconButton>
                      <Typography sx={{ fontWeight: '500', cursor: 'pointer' }} >{likeCount} likes</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                      <Tooltip title="Add a comment">
                        <IconButton >
                          <ChatBubbleOutlineOutlined />
                        </IconButton>
                      </Tooltip>

                      <Typography>{modalPost[0]?.post[0]?.comments.length}</Typography>
                    </FlexBetween>
                  </FlexBetween>





                </FlexBetween>
                {modalPost[0]?.post[0]?.isComments && (
                  <Box mt="0.5rem">


                    {modalPost[0]?.post[0]?.comments.map((comment, i) => (
                      <Box key={`${comment.userId}-${i}`}>

                        <Typography sx={{ color: "grey", m: "0.5rem 0", pl: "1rem" }}>
                          <Box sx={{ display: "flex" }}>
                            <Box height='2rem'>
                              {comment.userId &&
                                <CommentList userId={comment.userId} />}
                            </Box>


                            <Typography width={"13rem"} sx={{ ml: "0.5rem", mt: "0.4rem", fontSize: "0.9rem" }}> - {comment.comment}</Typography>


                          </Box>




                        </Typography>
                      </Box>
                    ))}
                    <Divider />
                  </Box>
                )}
              </WidgetWrapper>
              <Button onClick={() => setModal(false)}>Close</Button>
            </Box>
          </Box>
        </Modal> : null}
      </Box>
    </>
  )
}
export default Postmanagement;
