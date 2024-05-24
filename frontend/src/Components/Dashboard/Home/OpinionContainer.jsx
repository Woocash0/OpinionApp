import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { faUser, faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Loading from '../../Loading';
import "./opinionContainer.css";


const OpinionContainer = ({ existingOpinions, productId }) => {
  const [opinion, setOpinion] = useState('');
  const signOut = useSignOut();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const addOpinionHandler = async (e) => {
    e.preventDefault();
    try {
      if (opinion.trim() !== '') {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const authToken = cookies.find(cookie => cookie[0] === '_auth');
  
        const response = await axios.get('http://localhost:8000/account', {
          headers: {
            'Authorization': `Bearer ${authToken[1]}`
          }
        });
  
        setUserDetails(response.data.user);
        console.log(response.data.user.email);
        console.log(productId);
        console.log(opinion);
  
        const opinionResponse = await axios.post('http://localhost:8000/add_opinion', {
          productId: productId,
          opinionText: opinion,
          thumbsUp: 0,
          thumbsDown: 0,
          createdBy: response.data.user.id
        });
  
        console.log('Opinion added:', opinionResponse.data);
        toast.success("Opinion added");
        setOpinion('');
      }
    } catch (error) {
      console.error('Error adding opinion:', error.response.data.error);
    }
  };

  return (
    <div className='opinion-container'>
      <header className='opinion-header'>Opinions ({existingOpinions.length})</header>
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
      <div className='opinions'>
      {existingOpinions.map(opinon => (
                    <div className="opinion" key={opinon.id}>
                        <div className='opinion-details'>
                            <div className="user-profile">
                                <FontAwesomeIcon icon={faUser} className='opinion-icon' size='lg' style={{ color: 'white' }} />
                                <div id="createdBy">{opinon.createdBy}</div>
                            </div>
                            <div id="rating">Rating: {opinon.rating}</div>
                            <div className='opinion-reactions'>
                                <div id="thumbsUp"><FontAwesomeIcon icon={faThumbsUp} className='opinion-icon' size='lg' style={{color: "#ffffff",}} /> {opinon.thumbsUp}</div>
                                <div id="thumbsDown"><FontAwesomeIcon icon={faThumbsDown} className='opinion-icon' size='lg' style={{color: "#ffffff",}} /> {opinon.thumbsDown}</div>
                            </div>
                        </div>  
                        <div id="opinionText">{opinon.opinionText}</div>   
                        <div className='opinion_ratings'>
                            <div id="durability_rating">Durability: {opinon.durability_rating}</div>
                            <div id="price_rating">Price: {opinon.price_rating}</div>
                            <div id="design_rating">Design: {opinon.design_rating}</div>
                            <div id="capabilities_rating">Capabilities: {opinon.capabilities_rating}</div>
                        </div>
                        
                    </div>
                ))}
      </div>
    </div>
  );
};

export default OpinionContainer;
