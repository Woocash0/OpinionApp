import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-hot-toast";


const OpinionReactions = ({ opinionId, initialThumbsUp, initialThumbsDown, userReacted }) => {
  const [thumbsUp, setThumbsUp] = useState(initialThumbsUp);
  const [thumbsDown, setThumbsDown] = useState(initialThumbsDown);
  const [userReaction, setUserReaction] = useState(null); // 'up' or 'down'
  const [loading, setLoading] = useState(false);

  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const authToken = cookies.find(cookie => cookie[0] === '_auth');

  const handleThumbsUp = async () => {
    if (userReaction || loading) return; // User has already reacted or request in progress

    if(!authToken){
      toast.error("Login to react to an opinion", {
        className: 'react-hot-toast',
      });
    }
    setLoading(true);
    try {
        const response = await axios.post('http://localhost:8000/thumbs-up', 
            { 
              opinionId 
            },
            {
              headers: {
                'Authorization': `Bearer ${authToken[1]}`
              }
            }
          );
      if (response.data.success) {
        setThumbsUp(thumbsUp + 1);
        setUserReaction('up');
        toast.success("Thank you for your reaction", {
          className: 'react-hot-toast',
        });
      }
    } catch (error) {
      console.error('Error updating thumbs up');
      
      toast.error(error.response.data.message || 'An error occurred', {
        className: 'react-hot-toast',
      });

    } finally {
      setLoading(false);
    }
  };

  const handleThumbsDown = async () => {
    if (userReaction || loading) return; // User has already reacted or request in progress

    if(!authToken){
      toast.error("Login to react to an opinion", {
        className: 'react-hot-toast',
      });
    }

    setLoading(true);
    try {
        const response = await axios.post('http://localhost:8000/thumbs-down', 
            { 
              opinionId 
            },
            {
              headers: {
                'Authorization': `Bearer ${authToken[1]}`
              }
            }
          );
      if (response.data.success) {
        setThumbsDown(thumbsDown + 1);
        setUserReaction('down');
        toast.success("Thank you for your reaction", {
          className: 'react-hot-toast',
        });
      }
    } catch (error) {
      console.error('Error updating thumbs down');
      toast.error(error.response.data.message || 'An error occurred', {
        className: 'react-hot-toast',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='opinion-reactions'>
      <div id="thumbsUp" onClick={handleThumbsUp} style={{ cursor: loading || userReaction ? 'not-allowed' : 'pointer' }}>
        <FontAwesomeIcon icon={faThumbsUp} className='opinion-icon' size='lg' style={{ color: userReacted === 'up' ? '#076478' : '#ffffff' }} /> {thumbsUp}
      </div>
      <div id="thumbsDown" onClick={handleThumbsDown} style={{ cursor: loading || userReaction ? 'not-allowed' : 'pointer' }}>
        <FontAwesomeIcon icon={faThumbsDown} className='opinion-icon' size='lg' style={{ color: userReacted=== 'down' ? '#076478' : '#ffffff' }} /> {thumbsDown}
      </div>
    </div>
  );
};

export default OpinionReactions;
