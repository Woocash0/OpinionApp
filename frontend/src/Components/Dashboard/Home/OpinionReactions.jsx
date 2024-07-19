import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-hot-toast";


const OpinionReactions = ({ opinionId, initialThumbsUp, initialThumbsDown }) => {
  const [thumbsUp, setThumbsUp] = useState(initialThumbsUp);
  const [thumbsDown, setThumbsDown] = useState(initialThumbsDown);
  const [userReaction, setUserReaction] = useState(null); // 'up' or 'down'
  const [loading, setLoading] = useState(false);

  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const authToken = cookies.find(cookie => cookie[0] === '_auth');

  const handleThumbsUp = async () => {
    if (userReaction || loading) return; // User has already reacted or request in progress

    if(!authToken){
      toast.error("Login to react to an opinion");
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
      }
    } catch (error) {
      console.error('Error updating thumbs up');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbsDown = async () => {
    if (userReaction || loading) return; // User has already reacted or request in progress

    if(!authToken){
      toast.error("Login to react to an opinion");
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
      }
    } catch (error) {
      console.error('Error updating thumbs down');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='opinion-reactions'>
      <div id="thumbsUp" onClick={handleThumbsUp} style={{ cursor: loading || userReaction ? 'not-allowed' : 'pointer' }}>
        <FontAwesomeIcon icon={faThumbsUp} className='opinion-icon' size='lg' style={{ color: "#ffffff" }} /> {thumbsUp}
      </div>
      <div id="thumbsDown" onClick={handleThumbsDown} style={{ cursor: loading || userReaction ? 'not-allowed' : 'pointer' }}>
        <FontAwesomeIcon icon={faThumbsDown} className='opinion-icon' size='lg' style={{ color: "#ffffff" }} /> {thumbsDown}
      </div>
    </div>
  );
};

export default OpinionReactions;
