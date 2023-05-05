import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage/index";
import LoginPage from "./scenes/loginPage/index";
import ProfilePage from "./scenes/profilePage/index";
import ProfileEditPage from "scenes/profilePage/profileEditPage"; 
import { useMemo,  } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme"; 
import AdminLoginPage from "Admin/Adminlogin";
import AdminPanel from "Admin/AdminHome";
import Usermanagement from "Admin/usermanage/Usermanagemet";
import MessageComponent from "scenes/message/AllMessagePage";
import SingleChat from "scenes/message/SingleChat";
import Otploginpage from "scenes/loginPage/Otploginpage";


 


function App({ userIsAuthenticated, adminIsAuthenticated }) {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isauth = Boolean(useSelector((state) => state.token))
 

  const isAdminAuth = Boolean(useSelector((state) => state.adminToken))
  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />  

          <Routes>
            {/* Userside routes */}
            <Route path="/" element={isauth ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/otploginpage" element={isauth ? <Navigate to="/home" /> : <Otploginpage />}  />
            <Route path="/home" element={isauth ? <HomePage /> : <Navigate to="/" />} />
            <Route
              path="/profile/:userId"
              element={isauth ? <ProfilePage /> : <Navigate to="/" />}        
            />
            <Route
              path="/editProfile/:userId"  
              element={isauth ? <ProfileEditPage /> : <Navigate to="/" />} 
            /> 
            <Route
              path="/inbox/:userId" 
              element={isauth ? <MessageComponent /> : <Navigate to="/" />}
            /> 
             <Route
              path="/chatwith/:userId" 
              element={isauth ? <SingleChat /> : <Navigate to="/" />}
            /> 
    
            {/* Admin-side routes */}
            <Route path="/adminlogin" element={!isAdminAuth ? <AdminLoginPage /> : <Navigate to="/adminhome" />} />
            <Route
              path="/adminhome"
              element={isAdminAuth ? <AdminPanel /> : <Navigate to="/adminlogin" />}
            />
            <Route path="/usermanagement" element={isAdminAuth?<Usermanagement/>:<Navigate to='/adminlogin'/>} />
          </Routes>

   
        </ThemeProvider>


      </BrowserRouter> 
    </div>
  );
}

export default App;
