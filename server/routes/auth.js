import express from 'express'; 
import {login, sendPhoneNumber,sendOTP,adminLogin} from '../controllers/auth.js'

const router=express.Router();

router.post("/login", login)
router.post("/adminLogin",adminLogin)
router.post("/phone", sendPhoneNumber) 
router.post("/otp",sendOTP)

export default router;   