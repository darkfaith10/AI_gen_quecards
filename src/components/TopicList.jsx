import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import "../styles/TopicList.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function TopicList() {
    const [topicsList, setTopicsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function handleTopicClick(topic) {
        navigate(`/card-page/${topic._id}`);
    }

    async function handleDelete(e, topicId) {
        e.stopPropagation(); // Prevent navigation when clicking delete

        if (window.confirm("Are you sure you want to delete this topic?")) {
            try {
                await axios.delete(`${backendURL}/deleteTopic/${topicId}`);
                setTopicsList(topicsList.filter(topic => topic._id !== topicId));
            } catch (err) {
                alert("Failed to delete topic: " + err.message);
            }
        }
    }

    useEffect(() => {
        async function fetchTopicList() {
            try {
                const res = await axios.get(`${backendURL}/fetchTopicList`);
                setTopicsList(res.data);
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTopicList();
    }, []);

    if (loading) {
        return <div className="loading">Loading topics...</div>;
    }

    return (
        <div className="topiclist-container">
            <div className="topiclist-wrapper">
                <h1 className="topiclist-title">My QueCards</h1>
                <p className="topiclist-subtitle">Select a topic to start studying</p>

                {topicsList.length === 0 ? (
                    <div className="empty-state">
                        <p>No topics yet. Create your first QueCard!</p>
                    </div>
                ) : (
                    <ul className="topic-list">
                        {topicsList.map((topic) => (
                            <li key={topic._id} className="topic-item">
                                <div className="topic-card" onClick={() => handleTopicClick(topic)} >
                                    <span className="topic-title">{topic.title}</span>
                                    <button className="delete-button" onClick={(e) => handleDelete(e, topic._id)} aria-label="Delete topic" >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TopicList;