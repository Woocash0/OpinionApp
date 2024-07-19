import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-hot-toast";
import { format } from 'date-fns';
import "./opinionContainer.css";
import OpinionReactions from './OpinionReactions';
import Loading from '../../Loading';
import SortOptions from './SortOptions';

const OpinionContainer = ({ existingOpinions, productId }) => {
  const [opinion, setOpinion] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true); // Dodanie loading
  const [sortCriterion, setSortCriterion] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const signOut = useSignOut();
  const navigate = useNavigate();

  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const authToken = cookies.find(cookie => cookie[0] === '_auth');

  useEffect(() => {
    if (authToken) {
      axios.get('http://localhost:8000/account', {
        headers: {
          'Authorization': `Bearer ${authToken[1]}`
        }
      }).then(response => {
        setUserDetails(response.data.user);
        setUserEmail(response.data.user.email);
        setLoading(false); // Ustawienie loading na false po pobraniu danych
      }).catch(error => {
        console.error('Error fetching user details:', error);
        setLoading(false); // Ustawienie loading na false w przypadku błędu
      });
    } else {
      setLoading(false); // Ustawienie loading na false jeśli nie ma tokena
    }
  }, [authToken]);

  const addOpinionHandler = async (e) => {
    e.preventDefault();
    try {
      if (opinion.trim() !== '') {
        await axios.post('http://localhost:8000/add_opinion', {
          productId: productId,
          opinionText: opinion,
          thumbsUp: 0,
          thumbsDown: 0,
          createdBy: userDetails.id
        });

        toast.success("Opinion added");
        setOpinion('');
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      toast.error('Error adding opinion');
    }
  };

  const sortOpinions = (opinions) => {
    return [...opinions].sort((a, b) => {
      const aValue = a[sortCriterion];
      const bValue = b[sortCriterion];
      
      if (sortCriterion === 'createdAt') {
        // Parse dates if sorting by date
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (sortCriterion === 'totalReactions') {
        // Calculate total reactions with thumbsDown as negative
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
          />
          <button type="submit" className="add-opinion-button">Comment</button>
        </form>
      )}
      <div className='opinions'>
      <SortOptions onSortChange={handleSortChange} />
        {sortedOpinions.map(opinion => (
          <div className="opinion" key={opinion.id}>
            <div className='opinion-details'>
              <div className="user-profile">
                <FontAwesomeIcon icon={faUser} className='opinion-icon' size='lg' style={{ color: 'white' }} />
                <div id="createdBy">{opinion.createdBy}</div>
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
        ))}
      </div>
    </div>
  );
};

export default OpinionContainer;
