import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    mode:"light",
    user:null,
    token:null,
    posts:[],
    admin:null, 
    adminToken:null
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
            if (state.user && state.user._id === action.payload._id) {
                 
                setLogout(action.payload._id)
                state.token = null
              }
        }
        
          
        
       
 
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost,setAdminLogin,setAdminLogout,setUserIdNull} = authSlice.actions;
export default authSlice.reducer;