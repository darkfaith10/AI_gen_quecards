import { React } from "react";
import TopicList from "./TopicList";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Navbar from "./Navbar";

function Home() {
    const navigate = useNavigate();

    function handleAddNewTopic() {
        navigate("/new-topic-form");
    }

    return (
        <>
        <Navbar />
            <div className="home-header">
                <h1 className="home-title">Choose a topic to revise</h1>
            </div>

            <div className="add-topic">
                <Fab
                    color="secondary"
                    aria-label="add"
                    onClick={handleAddNewTopic}
                >
                    <AddIcon fontSize="large" />
                </Fab>
                <span className="add-topic-text">Add New Topic</span>

            </div>


            <TopicList />
        </>
    );
}

export default Home;