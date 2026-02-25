import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    function handleHome() {
        navigate("/home");
    }

    function handleNewTopic() {
        navigate("/new-topic-form");
    }

    function handleAbout() {
        navigate("/about-us");
    }

    function handleProfile() {
        navigate("/user-profile");
    }

    return <>
    <div className="navbar">
    <div className="navbar-left-container">
        <div className="navbar-items"><button onClick={handleHome}>QueCards</button></div>
        <div className="navbar-items"><button onClick={handleHome}>Topics</button></div>
        <div className="navbar-items"><button onClick={handleNewTopic}>New Topic</button></div>
        </div>
        <div className="navbar-right-container">
            <div className="navbar-items">
               <button onClick={handleAbout}>About Us</button>
            </div>
            <div className="navbar-items"><button onClick={handleProfile}>Profile</button> </div>
        </div>

    </div>
        
    </>
}

export default Navbar;