import React from "react";
import { useState, useEffect } from "react";
import {Context} from "../UserContext";

const backendURL = import.meta.env.VITE_BACKEND_URL;



function Login() {

    function handleLogin(){
        window.location.href = `${backendURL}/auth/google`;
    }




    return(
    <>
        <div>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    </>
)}

export default Login;
 
