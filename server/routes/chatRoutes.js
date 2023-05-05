import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { accessChat, fetchChats,getInboxChats } from '../controllers/chatControllers.js';

const router = express.Router();

router.post('/:id',verifyToken, accessChat); 
router.get("/inbox/:id",verifyToken,getInboxChats)
router.get('/:userId/:loginUserId',verifyToken, fetchChats); 
// router.post('/group',verifyToken, createGroupChat); 
// router.put('/rename',verifyToken, renameGroup);
// router.put('/groupremove',verifyToken, removeFromGroup); 
// router.put('/groupadd',verifyToken, addToGroup); 
 

   
 



export default router;