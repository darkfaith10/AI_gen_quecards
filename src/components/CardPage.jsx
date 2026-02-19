import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "../../public/CardPage.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function CardPage() {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        async function fetchTopic() {
            try {
                const res = await axios.get(`${backendURL}/fetchTopic/${id}`);
                setTopic(res.data);
            } catch (err) {
                alert(err.message);
            }
        }

        fetchTopic();
    }, [id]);

    if (!topic || !topic.QA) return <div className="loading">Loading...</div>;
    if (!topic.QA || topic.QA.length === 0) return <div className="loading">No Topic found</div>;

    const totalCards = topic.QA.length;
    const currentQA = topic.QA[current];

    function handlePrev() {
        setCurrent((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
    }

    function handleNext() {
        setCurrent((prev) => (prev === totalCards - 1 ? 0 : prev + 1));
    }

    return (
        <div className="cardpage-container">
            <h1 className="cardpage-title">{topic.title}</h1>

            <div className="cardpage-content">
                <button className="nav-button nav-button-left" onClick={handlePrev}>
                    <ArrowBackIosNewIcon fontSize="large" />
                </button>

                <div className="card-wrapper">
                    <Card question={currentQA.question} answer={currentQA.answer} />
                </div>

                <button className="nav-button nav-button-right" onClick={handleNext}>
                    <ArrowForwardIosIcon fontSize="large" />
                </button>
            </div>

            <p className="card-counter">
                {current + 1} / {totalCards}
            </p>
        </div>
    );
}

export default CardPage;