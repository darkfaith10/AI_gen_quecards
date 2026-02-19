import { React, useState, useEffect } from "react";
import TopicList from "./TopicList";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";


function Home() {

    const navigate = useNavigate();

    function handleAddNewTopic() {
        navigate("/new-topic-form");
    }


    return <>
        <div>
            <h1>Choose a topic to revise</h1>
        </div>
        <div>
            Add a new Topic    
            <a onClick={handleAddNewTopic}>
                <Fab color="secondary" aria-label="add">
                    <AddIcon fontSize="large"/>
                </Fab>
            </a>
        </div>
        <TopicList />
        
    </>
}

export default Home;