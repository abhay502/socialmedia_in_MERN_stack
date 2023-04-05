import express from 'express'

//local imports
import { getFeedPosts,getUserPosts, likePost ,commentPost,deletePostComment,deletePost} from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router=express.Router()

//READ

router.get('/', verifyToken, getFeedPosts)
router.get('/:userId/posts', verifyToken, getUserPosts)

//UPDATE

router.patch('/:id/like', verifyToken, likePost) 
router.patch('/:id/deleteComment', verifyToken, deletePostComment) 
router.patch('/:id/deletePost', verifyToken, deletePost) 

router.patch('/:id/comment',verifyToken,commentPost)
export default router;   