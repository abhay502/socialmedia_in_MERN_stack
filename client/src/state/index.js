import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    mode:"light",
    user:null,
    token:null,
    posts:[],
    admin:null, 
    adminToken:null,
    notification:[]
};  

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{ 
        setMode:(state)=>{  //theme slice
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setLogin: (state, action)=>{  // login slice 
            state.user = action.payload.user;
            state.token = action.payload.token;  
        },
        setNotification:(state,action)=>{
            state.notification = action.payload.notification;
        }, 
        setAdminLogin:(state, action)=>{
            state.admin = action.payload.admin;
            state.adminToken = action.payload.adminToken;
        },
        setAdminLogout:(state,action)=>{
            state.admin = null;
            state.adminToken = null;
        },
        setLogout: (state)=>{  
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action)=>{
            if(state.user){
                state.user.friends = action.payload.friends;
            }else{
                console.error("User friends non-exist")
            }
        },  
        setPosts: (state, action)=>{
            state.posts = action.payload.posts
        }, 
        setPost: (state, action)=>{
            const updatedPosts = state.posts.map((post)=>{  
                if(post._id === action.payload.post._id)return action.payload.post;
                return post;
            })
 
            state.posts = updatedPosts;
        },
        setUserIdNull: (state,action)=>{ 
            // console.log(state.user)
            // if(state.user.includes( action.payload._id)){
            //     state.user._id =null
            //     state.token = null
            // }
            

             
        }
        
          
        
       
 
    }
})

export const { setMode,setNotification, setLogin, setLogout, setFriends, setPosts, setPost,setAdminLogin,setAdminLogout,setUserIdNull} = authSlice.actions;
export default authSlice.reducer;