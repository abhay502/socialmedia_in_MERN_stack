import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { allMessages, sendMessage } from '../controllers/messageControllers.js';
const router = express.Router()

router.post('/sendmessage',verifyToken,sendMessage);
router.get('/:chatId',verifyToken,allMessages); 

 
export default router;    