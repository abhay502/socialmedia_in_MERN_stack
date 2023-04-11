import express from 'express';
import {getUser,getUserFriends,addRemoveFriends,getSearchedUsers,editProfile} from '../controllers/users.js'
import {verifyToken} from '../middleware/auth.js'


const router = express.Router()

//READ
router.get('/:id',verifyToken,getUser)
router.get('/:id/friends',verifyToken,getUserFriends)

router.post('/searchUsers',verifyToken,getSearchedUsers)
router.post('/:id/edit',verifyToken,editProfile);

//UPDATE
router.patch('/:id/:friendId',verifyToken,addRemoveFriends)

export default router;   