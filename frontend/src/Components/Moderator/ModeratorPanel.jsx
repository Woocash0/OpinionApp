import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModeratorPanel = () => {
    const [opinions, setOpinions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [remainingCount, setRemainingCount] = useState(0);

    useEffect(() => {
        // Fetch uninspected opinions from the backend
        const fetchOpinions = async () => {
            try {
                const response = await axios.get('/uninspected');
                setOpinions(response.data);
                setRemainingCount(response.data.length);
            } catch (error) {
                console.error('Error fetching opinions:', error);
            }
        };
        fetchOpinions();
    }, []);

    const handleAccept = async () => {
        if (opinions.length === 0) return;
        const opinionId = opinions[currentIndex].id;

        try {
            await axios.post(`http://localhost:8000/inspect/accept/${opinionId}`);
            setOpinions(opinions.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
            setRemainingCount(opinions.length - 1);
        } catch (error) {
            console.error('Error accepting opinion:', error);
        }
    };

    const handleDelete = async () => {
        if (opinions.length === 0) return;
        const opinionId = opinions[currentIndex].id;

        try {
            await axios.delete(`http://localhost:8000/inspect/delete/${opinionId}`);
            setOpinions(opinions.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
            setRemainingCount(opinions.length - 1);
        } catch (error) {
            console.error('Error deleting opinion:', error);
        }
    };

    const nextOpinion = () => {
        if (currentIndex < opinions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousOpinion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div>
            <h1>You have {remainingCount} uninspected opinions remaining to check</h1>
            {opinions.length > 0 ? (
                <div>
                    <div>
                        <h2>Opinion ID: {opinions[currentIndex].id}</h2>
                        <p><strong>Product Name:</strong> {opinions[currentIndex].productName}</p>
                        <p><strong>Category:</strong> {opinions[currentIndex].productCategory}</p>
                        <p><strong>Rating:</strong> {opinions[currentIndex].rating}</p>
                        <p><strong>Created At:</strong> {opinions[currentIndex].createdAt}</p>
                        <p><strong>Opinion Text:</strong> {opinions[currentIndex].opinionText}</p>
                    </div>
                    <div>
                        <button onClick={handleAccept}>Accept</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                    <div>
                        <button onClick={previousOpinion} disabled={currentIndex === 0}>Previous</button>
                        <button onClick={nextOpinion} disabled={currentIndex === opinions.length - 1}>Next</button>
                    </div>
                </div>
            ) : (
                <p>No uninspected opinions left.</p>
            )}
        </div>
    );
};

export default ModeratorPanel;
