import express from 'express'; 
import {login, sendPhoneNumber} from '../controllers/auth.js'

const router=express.Router();

router.post("/login", login)
router.post("/phone", sendPhoneNumber)

export default router;