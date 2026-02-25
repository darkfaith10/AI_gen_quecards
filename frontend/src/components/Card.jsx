import React, { useState } from "react";
import "../styles/Card.css";
import Navbar from "./Navbar";

function Card(props) {
    const [viewAnswer, setViewAnswer] = useState(false);

    function handleShowAnswer() {
        setViewAnswer(!viewAnswer);
    }

    return (
        <div>
            <Navbar />
            <div className="card-container">
                <div className="card">
                    <div className="card-content">
                        <h2 className="card-question">{props.question}</h2>
                        {viewAnswer && (
                            <div className="card-answer-container">
                                <p className="card-answer">{props.answer}</p>
                            </div>
                        )}
                    </div>
                    <button className="card-toggle" onClick={handleShowAnswer}>
                        {viewAnswer ? "Hide" : "Show"} answer
                    </button>
                </div>
            </div>
        </div>

    );
}

export default Card;