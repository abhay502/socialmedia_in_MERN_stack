import express from 'express'; 
import {login, sendEmail,sendOTP,adminLogin} from '../controllers/auth.js'

const router=express.Router();

router.post("/login", login)
router.post("/adminLogin",adminLogin)
router.post("/email", sendEmail)  
router.post("/otp",sendOTP) 

export default router;       