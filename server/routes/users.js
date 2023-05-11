import express from 'express';
import {getUser,getUserFriends,addRemoveFriends,getSearchedUsers,editProfile,getAllUsers,blockUser,getUserForAdmin,
    getTotalActiveUsers} from '../controllers/users.js'
import {verifyToken} from '../middleware/auth.js'
import multer from 'multer';

const router = express.Router()

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

//READ
router.get('/:id',verifyToken,getUser)
router.get('/:id/friends',verifyToken,getUserFriends)
router.get('/find/getAllUsers',verifyToken,getAllUsers)  
router.get('/searchUserAdmin/:searchKey',verifyToken,getUserForAdmin)
router.get('/get/totalActiveUsers',verifyToken,getTotalActiveUsers)


router.post('/searchUsers',verifyToken,getSearchedUsers) 
router.post('/:id/edit',verifyToken,upload.single("picture"),editProfile);

//UPDATE
router.patch('/:id/:friendId',verifyToken,addRemoveFriends)
router.patch('/:id/find/blockUser',verifyToken,blockUser)

export default router;   