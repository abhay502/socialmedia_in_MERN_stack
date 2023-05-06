import express from 'express';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';
//local imports 
import authRoutes from './routes/auth.js'
import { verifyToken } from './middleware/auth.js';
import {register} from './controllers/auth.js'
import userRoutes from './routes/users.js'                      
import postRoutes from './routes/posts.js'
import chatRoutes from './routes/chatRoutes.js' 
import messageRoutes from './routes/messageRoutes.js'
import {createPost} from './controllers/posts.js'


//BACKEND CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app=express();
app.use(cors()); 


app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

app.use("/assets",express.static(path.join(__dirname,'public/assets')))

//FILE STORAGE
const storage=multer.diskStorage({  
    destination:(req,file,cb)=>{
        cb(null,"public/assets")
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    },   
});
export const upload = multer({
    storage:storage,
    limits:{ 
        fileSize: 1024 * 1024 * 50 //50mb  
    }
});   

//ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken,  upload.single("picture"),createPost)
app.post("/posts/video", verifyToken,  upload.single("video"),createPost)
//ROUTES
app.use("/auth", authRoutes); 
app.use("/users", userRoutes); 
app.use("/posts", postRoutes);
app.use("/chat",chatRoutes)
app.use("/message",messageRoutes);

//MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true,  

}).then(()=>{

 const server =   app.listen(PORT,()=>console.log(`Server Port:${PORT}`)) 
 
 const io = new Server(server, {
    pingTimeout:60000,
    cors: {
      origin: "http://localhost:3000",
      
    }
  });

  io.on("connection",(socket)=>{
    console.log('connected to socket.io')

    socket.on('setup',(userData)=>{
      socket.join(userData._id);
      console.log(userData._id)
      socket.emit("connected");
    });
    socket.on("blockUser",(userId)=>socket.emit('logoutUser'));
    socket.on("join chat",(room)=>{
       socket.join(room);
       console.log("User Joined Room : "+room)
    });

    socket.on('typing',(room)=>socket.in(room).emit('typing'));
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'));


    socket.on("blockUser",(userId)=>{
        console.log("blockuserId",userId)
         
        socket.in(userId).emit("logout user",userId) 
    })    
    
         
    socket.on("new message",(newMessageRecived)=>{ 
        var chat = newMessageRecived.chat;
        if(!chat.users) return console.log('chat.users not defined');
   
        chat.users.forEach(user =>{ 
            console.log("userId:"+user._id)
            console.log("senderId"+newMessageRecived.sender._id) 
              
            socket.in(user._id).emit("message recieved",newMessageRecived);                                   
        })
    })

    socket.off("setup",()=>{  
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    })
  })


   
}).catch((error)=>console.log(`Error Message:${error.message}`))  
       