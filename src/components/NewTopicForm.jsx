import axios from "axios";
import React, { useState } from "react";
import "../styles/NewTopicForm.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function NewTopicForm() {
    const [title, setTitle] = useState("");
    const [inputType, setInputType] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleForm(e) {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("inputType", inputType);

            if (file) {
                formData.append("file", file);
            }

            // await axios.post(`${backendURL}/cardGenerator`, formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data"
            //     },
            // });

            await axios.post(
                `${backendURL}/cardGenerator`, formData,
                { withCredentials: true }
            );

            setSuccess(true);
            // Reset form
            setTitle("");
            setInputType("");
            setFile(null);
            e.target.reset();

        } catch (err) {
            setError("Failed to submit form. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { value, name, files } = event.target;

        if (name === 'title') {
            setTitle(value);
        } else if (name === 'inputType') {
            setInputType(value);
        } else if (name === "file") {
            setFile(files[0]);
        }
    }

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <h1 className="form-title">Create New QueCards</h1>
                <p className="form-subtitle">Upload your study material and generate flashcards</p>

                <form onSubmit={handleForm} className="topic-form">

                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Title for the QueCards
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., Java Fundamentals"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label className="form-label">Select input type</label>
                        <div className="radio-group">
                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="pdf"
                                    name="inputType"
                                    value="pdf"
                                    checked={inputType === "pdf"}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <label htmlFor="pdf" className="radio-label">
                                    📄 PDF Document
                                </label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="image"
                                    name="inputType"
                                    value="image"
                                    checked={inputType === "image"}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <label htmlFor="image" className="radio-label">
                                    🖼️ Image
                                </label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="link"
                                    name="inputType"
                                    value="link"
                                    checked={inputType === "link"}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <label htmlFor="link" className="radio-label">
                                    🔗 Website Link
                                </label>
                            </div>
                        </div>
                    </div>


                    <div className="form-group">
                        <label htmlFor="file" className="form-label">
                            Upload file
                        </label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleChange}
                                className="file-input"
                                accept={inputType === "pdf" ? ".pdf" : inputType === "image" ? "image/*" : "*"}
                            />
                            <label htmlFor="file" className="file-input-label">
                                {file ? file.name : "Choose a file"}
                            </label>
                        </div>
                    </div>


                    {error && (
                        <div className="message error-message">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="message success-message">
                            ✅ QueCards created successfully!
                        </div>
                    )}


                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !title || !inputType || !file}
                    >
                        {loading ? "Generating..." : "Create QueCards"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewTopicForm;