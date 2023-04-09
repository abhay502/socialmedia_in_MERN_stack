
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage/index";
import LoginPage from "./scenes/loginPage/index";
import ProfilePage from "./scenes/profilePage/index";
import ProfileEditPage from "scenes/profilePage/profileEditPage"; 
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme"; 



function App() {
  const mode = useSelector((state)=>state.mode);
  const theme = useMemo(()=>createTheme(themeSettings(mode)),[mode])
  const isauth = Boolean(useSelector((state)=> state.token))

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline/> 

      <Routes>
        <Route path="/" element={isauth? <Navigate to="/home"/>  :  <LoginPage/>}/>
        <Route path="/home" element={isauth ? <HomePage/> : <Navigate to="/"/>}/>
        <Route path="/profile/:userId" element={isauth ? <ProfilePage/> : <Navigate to="/"/>}/>
        <Route path="/editProfile/:userId" element={isauth ?  <ProfileEditPage /> : <Navigate to="/"/> }/>


      </Routes>

      </ThemeProvider>
      
      
      </BrowserRouter>
    </div>
  ); 
}

export default App;
