import express from 'express'; 
import {login, sendPhoneNumber,sendOTP} from '../controllers/auth.js'

const router=express.Router();

router.post("/login", login)
router.post("/phone", sendPhoneNumber) 
router.post("/otp",sendOTP)

export default router;  