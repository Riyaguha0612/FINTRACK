import React,{useState,useContext} from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import Home from "./Home";
import {Route,Routes,Navigate} from "react-router-dom";
import Launchpage from "./Launchpage";
import { UserContext } from "./UserContext";
const Body=()=>{
    const {isAuthenticated}=useContext(UserContext);
    return(<React.Fragment>
        <Routes>
            {!isAuthenticated?(
                <>
                    <Route path="/" element={<Launchpage/>}></Route>
                    <Route path="/signin" element={<Signin/>}></Route>
                    <Route path="/signup" element={<Signup/>}></Route>
                </>
            ):(
                <>
                    
                    <Route path="/home/*" element={<Home/>}></Route>
                    <Route path="*" element={<Navigate to="/home/dashboard"/>} />
                </>
            )}
        </Routes>
    </React.Fragment>);
}
export default Body;