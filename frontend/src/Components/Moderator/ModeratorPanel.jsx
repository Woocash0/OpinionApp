import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./moderatorPanel.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';


const ModeratorPanel = () => {
    const [opinions, setOpinions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [remainingCount, setRemainingCount] = useState(0);

    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0] === '_auth');

    useEffect(() => {
        const fetchOpinions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/uninspected', {
                    headers: {
                      'Authorization': `Bearer ${authToken[1]}`
                    }
                  });
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
            await axios.post(`http://localhost:8000/inspect/accept/${opinionId}`, {}, {
                headers: {
                  'Authorization': `Bearer ${authToken[1]}`
                }
              });
            setOpinions(opinions.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
            setRemainingCount(opinions.length - 1);
            toast.success("Opinion accepted", {
                className: 'react-hot-toast',
            });
        } catch (error) {
            console.error('Error accepting opinion:', error);
            toast.error("Opinion accept error", {
                className: 'react-hot-toast',
            });
        }
    };

    const handleDelete = async () => {
        if (opinions.length === 0) return;
        const opinionId = opinions[currentIndex].id;

        try {
            await axios.post(`http://localhost:8000/inspect/delete/${opinionId}`, {}, {
                headers: {
                  'Authorization': `Bearer ${authToken[1]}`
                }
              });
            setOpinions(opinions.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
            setRemainingCount(opinions.length - 1);
            toast.success("Opinion deleted", {
                className: 'react-hot-toast',
            });
        } catch (error) {
            console.error('Error deleting opinion:', error);
            toast.error("Opinion delete error", {
                className: 'react-hot-toast',
            });
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
            <header>You have {remainingCount} uninspected opinions remaining to check</header>
            {opinions.length > 0 ? (
                <div className='decision_container'>
                    <div className='buttons_container_1'>
                        <button className='mod_button' onClick={previousOpinion} disabled={currentIndex === 0}>Previous</button>
                        <div className='quantity_check'>{currentIndex+1}/{opinions.length}</div>
                        <button className='mod_button' onClick={nextOpinion} disabled={currentIndex === opinions.length - 1}>Next</button>
                    </div>
                    <div className='checked_opinion'>
                        <div className='opinion-text'>
                            <div className='opinion_details'>
                                <strong>{opinions[currentIndex].createdBy}</strong>
                                <div> {(opinions[currentIndex].createdAt).slice(0, -3)}</div>
                                <div className='reactions'>
                                    <div><FontAwesomeIcon icon={faThumbsUp} className='opinion-icon' size='lg' style={{ color: '#261132' }} />{opinions[currentIndex].thumbsUp}</div>
                                    <div><FontAwesomeIcon icon={faThumbsDown} className='opinion-icon' size='lg' style={{ color: '#261132' }} />{opinions[currentIndex].thumbsDown}</div>
                                </div>
                            </div>
                          <p>{opinions[currentIndex].opinionText}</p>
                        </div>
                        <div className='opinion_info'>
                            <div><strong>Opinion ID:</strong> {opinions[currentIndex].id}</div>
                            <div><strong>Product:</strong> {opinions[currentIndex].productName}</div>
                            <div><strong>Category:</strong> {opinions[currentIndex].productCategory}</div>
                            <div><strong>Rating:</strong> {opinions[currentIndex].rating}</div>
                        </div>
                        
                    </div>
                    <div className='buttons_container_2'>
                        <button className='mod_button' id='accept_button' onClick={handleAccept}>Accept</button>
                        <button className='mod_button' id='delete_button' onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            ) : (
                <p>No uninspected opinions left.</p>
            )}
        </div>
    );
};

export default ModeratorPanel;
