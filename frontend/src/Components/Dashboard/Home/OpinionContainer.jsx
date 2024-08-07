import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-hot-toast";
import { format } from 'date-fns';
import "./opinionContainer.css";
import OpinionReactions from './OpinionReactions';
import Loading from '../../Loading';
import SortOptions from './SortOptions';
import useRefreshToken from '../../../hooks/useRefreshToken';

const OpinionContainer = ({ existingOpinions, productId }) => {
  const [opinion, setOpinion] = useState('');
  const [reactions, setReactions] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true); // Dodanie loading
  const [sortCriterion, setSortCriterion] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const refreshToken = useRefreshToken();


  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const authToken = cookies.find(cookie => cookie[0] === '_auth');

  useEffect(() => {
    const fetchUserReaction = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-reactions/${productId}`, {
          headers: {
            'Authorization': `Bearer ${authToken[1]}`
          }
        });
        setReactions(response.data.reactions);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Token expired or invalid. Attempting to refresh.");
          try {
            const newAuthToken = await refreshToken();
            if (newAuthToken) {
              // Ponów żądanie po odświeżeniu tokena
              const retryResponse = await axios.get(`http://localhost:8000/user-reactions/${productId}`, {
                headers: {
                  'Authorization': `Bearer ${newAuthToken}`
                }
              });
              setReactions(retryResponse.data.reactions);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            // Obsłuż błąd odświeżania tokena, np. przekierowanie do logowania
          }
        } else {
          console.error('Error fetching user reaction:', error);
        }
      }
    };

    if (authToken) {
      fetchUserReaction();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserAccount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/account', {
          headers: {
            'Authorization': `Bearer ${authToken[1]}`
          }
        });
        setUserDetails(response.data.user);
        setUserEmail(response.data.user.email);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Token expired or invalid. Attempting to refresh.");
          try {
            const newAuthToken = await refreshToken();
            if (newAuthToken) {
              const retryResponse = await axios.get('http://localhost:8000/account', {
                headers: {
                  'Authorization': `Bearer ${newAuthToken}`
                }
              });
              setUserDetails(retryResponse.data.user);
              setUserEmail(retryResponse.data.user.email);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        } else {
          console.error('Error fetching user account:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchUserAccount();
    } else {
      setLoading(false);
    }
  }, []);

  const addOpinionHandler = async (e) => {
    e.preventDefault();
    try {
      if (opinion.trim() !== '') {
        await axios.post('http://localhost:8000/add_opinion', {
          productId: productId,
          opinionText: opinion,
          createdBy: userDetails.id
        });

        toast.success("Opinion added", {
          className: 'react-hot-toast',
        });
        setOpinion('');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error adding opinion', {
        className: 'react-hot-toast',
      });
    }
  };

  const sortOpinions = (opinions) => {
    return [...opinions].sort((a, b) => {
      const aValue = a[sortCriterion];
      const bValue = b[sortCriterion];
      
      if (sortCriterion === 'createdAt') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (sortCriterion === 'totalReactions') {
        const aTotal = (a.thumbsUp || 0) - (a.thumbsDown || 0);
        const bTotal = (b.thumbsUp || 0) - (b.thumbsDown || 0);
        return sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const handleSortChange = (criterion, order) => {
    setSortCriterion(criterion);
    setSortOrder(order);
  };

  const sortedOpinions = sortOpinions(existingOpinions);

  const userHasCommented = existingOpinions.some(opinion => opinion.createdBy === userEmail);

  return (
    <div className='opinion-container'>
      <header className='opinion-header'>Opinions ({existingOpinions.length})</header>
      {authToken && !loading && !userHasCommented && ( // Sprawdzenie czy użytkownik jest zalogowany i nie dodał komentarza
        <form onSubmit={addOpinionHandler}>
          <input
            type="text"
            className="inputOpinion"
            placeholder="What is your opinion about this product?"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            id="opinionInput"
            name="opinion"
          />
          <button type="submit" className="add-opinion-button">Comment</button>
        </form>
      )}
      <div className='opinions'>
      <SortOptions onSortChange={handleSortChange} />
      {sortedOpinions.map(opinion => {
          const userReacted = reactions.find(r => r.opinionId === opinion.id);
          return (
            <div className="opinion" key={opinion.id}>
              <div className='opinion-details'>
                <div className="user-profile">
                  <FontAwesomeIcon icon={faUser} className='opinion-icon' size='lg' style={{ color: opinion.createdBy === userEmail ? '#076478' : 'white' }} />
                  <div id="createdBy" >{opinion.createdBy}</div>
                </div>
                <div className="opinion-creation-date">
                  <FontAwesomeIcon icon={faClock} className='opinion-icon' size='lg' style={{ color: 'white' }} />
                  <div id="createdAt">{format(new Date(opinion.createdAt), 'yyyy-MM-dd HH:mm')}</div>
                </div>
                <div id="rating">Rating: {opinion.rating}</div>
                <OpinionReactions
                  opinionId={opinion.id}
                  initialThumbsUp={opinion.thumbsUp}
                  initialThumbsDown={opinion.thumbsDown}
                  userReacted={userReacted ? userReacted.reaction : null}
                />
              </div>  
              <div id="opinionText">{opinion.opinionText}</div>   
              <div className='opinion_ratings'>
                <div id="price_rating">Price: {opinion.price_rating == null ? 'X' : opinion.price_rating}</div>
                <div id="durability_rating">Durability: {opinion.durability_rating == null ? 'X' : opinion.durability_rating}</div>
                <div id="capabilities_rating">Capabilities: {opinion.capabilities_rating == null ? 'X' : opinion.capabilities_rating}</div>
                <div id="design_rating">Design: {opinion.design_rating == null ? 'X' : opinion.design_rating}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpinionContainer;
