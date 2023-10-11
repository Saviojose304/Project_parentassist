import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
function Logout() {
    const navigate = useNavigate();
    const [pageReloaded, setPageReloaded] = useState(false);

    useEffect = () =>{
            try {
                googleLogout();
                localStorage.removeItem('token');
                if (!pageReloaded) {
                    window.location.reload();
                    setPageReloaded(true);
                }
                navigate('/')
    
            } catch (error) {
                console.log(error);
            }
    }
    

    return ( 
        <>

        </>
     );
}

export default Logout;