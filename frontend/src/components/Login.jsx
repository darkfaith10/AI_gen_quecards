import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {Context} from "../UserContext";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;



function Login() {

    const {logged, setLogged, userId, serUserId} = useContext(Context);


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
 
