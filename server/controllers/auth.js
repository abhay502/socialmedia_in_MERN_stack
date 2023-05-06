import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import userotp from '../models/UserOtp.js';
import dotenv from 'dotenv';
dotenv.config();
// email config


const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD,
    },
})

   

 
//REGISTER USER 
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, number } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, password: passwordHash,
            picturePath, friends, location, number, viewdProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//LOGGING IN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (user.isBlocked) {
            res.status(401).json({ msg: "User is blocked ! " })
        }else if (!user) {
            return res.status(400).json({ msg: "User doesn't exist ! " })
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch){
                return res.status(400).json({ msg: "Password You entered is Incorrect!" })
            }else{
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                delete user.password;
                res.status(200).json({ token, user })
            } 

           
        }
       

        

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = { email: 'admin@gmail.com', password: 'admin123321', _id: '6417024a5549b6da0b683816' }
        if (email === admin.email && password == admin.password) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
            res.status(200).json({ token })
        } else {
            res.status(400).json({ msg: "Password or Email You entered is Incorrect!" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const sendEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
       
        if (user) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const existEmail = await userotp.findOne({ email: email });
            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from:process.env.EMAIL,
                    to: email,
                    subject: "Sending email for OTP validation", 
                    text:`This is your OTP for Social media MERN stack project :- ${OTP}`
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error is : ", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email send ", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            } else {
                const saveOtpData = new userotp({
                    email, otp: OTP
                });
                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL, 
                    to: email,
                    subject: "Sending email for OTP validation",
                    text: `This is your OTP for Social media MERN stack project :- ${OTP}`
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error is : ", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email send ", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            }
            res.status(200).json(user)
        } else {
            res.status(400).json({ error: "Email doesn't exist" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


export const sendOTP = async (req, res) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        console.log(otp, email)
        if(otp && email){
            try {
                const otpverification = await userotp.findOne({email:email});

                if(otpverification.otp === otp){
                    const user = await User.findOne({email:email})
                    if (user.isBlocked) {
                        res.status(401).json({ msg: "User is blocked ! " })
                    }else{
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                        res.status(200).json({ token, user })
                    }
                  


                }else{
                    res.status(400).json({error:"Invalid OTP"});
                }

            } catch (error) {
                res.status(400).json({error:error});
                
            }
        }
        

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
} 

