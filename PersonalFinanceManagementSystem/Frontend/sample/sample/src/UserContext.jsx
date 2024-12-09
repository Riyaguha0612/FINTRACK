/* eslint-disable react/prop-types */
import React,{createContext,useState,useEffect} from 'react'

export const UserContext =createContext();
export const UserProvider = ({children})=>{
    
    const  [username, setUsername] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    return(
        <React.Fragment>
        <UserContext.Provider value={{username, setUsername,isAuthenticated,setIsAuthenticated}}>
            {children}
        </UserContext.Provider>
        </React.Fragment>
    )
};

