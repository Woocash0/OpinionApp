import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddButton from '../images/add_button.svg';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { toast } from 'react-hot-toast';
import Loading from '../Loading';
import { motion } from "framer-motion";
import useRefreshToken from '../../hooks/useRefreshToken';

const Warranties = ({ onSelectWarranty }) => {
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true); // Dodaj stan do śledzenia ładowania
    const signOut = useSignOut();
    const navigate = useNavigate();
    const refreshToken = useRefreshToken(); 
    const currentDate = new Date();

    useEffect(() => {
        const fetchWarranties = async () => {
          setLoading(true);
          const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
          const authToken = cookies.find(cookie => cookie[0] === '_auth');
    
          if (!authToken) {
            console.error('No auth token found');
            navigate('/loginform');
            toast.error('Authentication token missing. Please log in again.', {
              className: 'react-hot-toast',
            });
            setLoading(false);
            return;
          }
    
          try {
            const response = await axios.get('http://localhost:8000/account', {
              headers: {
                'Authorization': `Bearer ${authToken[1]}`
              }
            });
            const userEmail = response.data.user.email;
            
            try {
              const warrantiesResponse = await axios.get('http://localhost:8000/warranties', {
                params: {
                  owner: userEmail
                }
              });
              setWarranties(Array.isArray(warrantiesResponse.data.warranties) ? warrantiesResponse.data.warranties : []);
            } catch (warrantiesError) {
              toast.error("Error getting warranties", warrantiesError.response?.data?.message || 'An error occurred', {
                className: 'react-hot-toast',
              });
              setWarranties([]);
            }
    
          } catch (error) {
            if (error.response && error.response.status === 401) {
              console.log("Token expired or invalid. Attempting to refresh.");
              try {
                const newAuthToken = await refreshToken();
                if (newAuthToken) {
                  // Ponów żądanie po odświeżeniu tokena
                  const retryResponse = await axios.get('http://localhost:8000/account', {
                    headers: {
                      'Authorization': `Bearer ${newAuthToken}`
                    }
                  });
                  const userEmail = retryResponse.data.user.email;
                  
                  try {
                    const warrantiesResponse = await axios.get('http://localhost:8000/warranties', {
                      params: {
                        owner: userEmail
                      }
                    });
                    setWarranties(Array.isArray(warrantiesResponse.data.warranties) ? warrantiesResponse.data.warranties : []);
                  } catch (warrantiesError) {
                    toast.error("Error getting warranties", warrantiesError.response?.data?.message || 'An error occurred', {
                      className: 'react-hot-toast',
                    });
                    setWarranties([]);
                  }
                }
              } catch (refreshError) {
                toast.error("Session expired. Please log in again.", {
                  className: 'react-hot-toast',
                });
                signOut();
                navigate('/loginform');
              }
            } else {
              toast.error("Authorization Error", error.response?.data?.message || 'An error occurred', {
                className: 'react-hot-toast',
              });
              signOut();
              navigate('/loginform');
            }
          } finally {
            setLoading(false);
          }
        };
    
        fetchWarranties();
      }, []);

    const calculateExpirationDate = (purchaseDate, warrantyPeriod) => {
        const purchase = new Date(purchaseDate);
        purchase.setFullYear(purchase.getFullYear() + warrantyPeriod);
        return purchase;
    };

    const activeWarranties = warranties.filter(warranty => {
        const expirationDate = calculateExpirationDate(warranty.purchaseDate, warranty.warrantyPeriod);
        return expirationDate > currentDate;
    });

    const inactiveWarranties = warranties.filter(warranty => {
        const expirationDate = calculateExpirationDate(warranty.purchaseDate, warranty.warrantyPeriod);
        return expirationDate <= currentDate;
    });

    if (loading) {
        return <Loading />; 
    }

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.3 }}
    >
            <Link to="/add_warranty" className="add_button">
                <img src={AddButton} alt="Add Warranty" />
            </Link>

            <header>Active warranties ({activeWarranties.length})</header>
            <section className="warranties">
                {Array.isArray(activeWarranties) && activeWarranties.map(warranty => (
                    <div className="warranty_box" key={warranty.id} onClick={() => onSelectWarranty(warranty)}>
                        <img src={require(`../../Images/iconImages/${warranty.category}.svg`)} alt={warranty.product_name} />
                        <div className="imgname">{warranty.category}</div>
                    </div>
                ))}
            </section>

            <header>Expired warranties ({inactiveWarranties.length})</header>
            <section className="warranties">
                {Array.isArray(inactiveWarranties) && inactiveWarranties.map(warranty => (
                    <div className="warranty_box" key={warranty.id} onClick={() => onSelectWarranty(warranty)}>
                        <img src={require(`../../Images/iconImages/${warranty.category}.svg`)} alt={warranty.product_name} />
                        <div className="imgname">{warranty.category}</div>
                    </div>
                ))}
            </section>
        </motion.div>
    );
};

export default Warranties;
