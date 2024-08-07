import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./inspectOpinionsPanel.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import Loading from '../Loading';
import useRefreshToken from '../../hooks/useRefreshToken';



const ApproveNewProducts = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [remainingCount, setRemainingCount] = useState(0);
    const signOut = useSignOut();
    const navigate = useNavigate();
    const refreshToken = useRefreshToken(); 
    const [loading, setLoading] = useState(true);

    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0] === '_auth');

    useEffect(() => {
        const fetchUnapprovedProducts = async () => {
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
              const response = await axios.get('http://localhost:8000/unapproved', {
                headers: {
                  'Authorization': `Bearer ${authToken[1]}`
                }
              });
              setProducts(response.data);
              setRemainingCount(response.data.length);
            } catch (error) {
              if (error.response && error.response.status === 401) {
                console.log("Token expired or invalid. Attempting to refresh.");
                try {
                  const newAuthToken = await refreshToken();
                  if (newAuthToken) {
                    const retryResponse = await axios.get('http://localhost:8000/unapproved', {
                      headers: {
                        'Authorization': `Bearer ${newAuthToken}`
                      }
                    });
                    setProducts(retryResponse.data);
                    setRemainingCount(retryResponse.data.length);
                  }
                } catch (refreshError) {
                  toast.error("Session expired. Please log in again.", {
                    className: 'react-hot-toast',
                  });
                  signOut();
                  navigate('/loginform');
                }
              } else {
                toast.error("Error fetching products", error.response?.data?.message || 'An error occurred', {
                  className: 'react-hot-toast',
                });
                setProducts([]);
              }
            } finally {
              setLoading(false);
            }
          };
          
          fetchUnapprovedProducts();
    }, []);

    const handleAccept = async () => {
        if (products.length === 0) return;
        const productId = products[currentIndex].id;

        try {
            await axios.post(`http://localhost:8000/product/approve/${productId}`, {}, {
                headers: {
                  'Authorization': `Bearer ${authToken[1]}`
                }
              });
            setProducts(products.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
            setRemainingCount(products.length - 1);
            toast.success("Product approved", {
                className: 'react-hot-toast',
            });
        } catch (error) {
            console.error('Error approving product:', error);
            toast.error("Product approve error", {
                className: 'react-hot-toast',
            });
        }
    };

    const handleDelete = async () => {
        if (products.length === 0) return;
        const productId = products[currentIndex].id;

        try {
            await axios.post(`http://localhost:8000/product/disapprove/${productId}`, {}, {
                headers: {
                  'Authorization': `Bearer ${authToken[1]}`
                }
              });
            setProducts(products.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
            setRemainingCount(products.length - 1);
            toast.success("Product disapproved", {
                className: 'react-hot-toast',
            });
        } catch (error) {
            console.error('Error disapproving product:', error);
            toast.error("Product disapprove error", {
                className: 'react-hot-toast',
            });
        }
    };

    const nextProduct = () => {
        if (currentIndex < products.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousProduct = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return <Loading />; 
    }

    return (
        <div>
            <header>You have {remainingCount} product remaining to approve</header>
            {products.length > 0 ? (
                <div className='decision_container'>
                    <div className='buttons_container_1'>
                        <button className='mod_button' onClick={previousProduct} disabled={currentIndex === 0}>Previous</button>
                        <div className='quantity_check'>{currentIndex+1}/{products.length}</div>
                        <button className='mod_button' onClick={nextProduct} disabled={currentIndex === products.length - 1}>Next</button>
                    </div>
                    <div className='checked_opinion'>
                        <div className='opinion_info'>
                            <div><strong>Product ID:</strong> {products[currentIndex].id}</div>
                            <div><strong>Name:</strong> {products[currentIndex].productName}</div>
                            <div><strong>Category:</strong> {products[currentIndex].category}</div>
                            <div><strong>Producer:</strong> {products[currentIndex].producer}</div>
                            <div><strong>Barcode:</strong> {products[currentIndex].barcode}</div>
                            <div><strong>Creator:</strong> {products[currentIndex].creator}</div>
                        </div>
                        <div className='opinion_info'>
                            <div><strong>Description:</strong> {products[currentIndex].description}</div>
                            <div><img className='product-image' src={require(`../../Images/productImages/${products[currentIndex].image}`)} alt={products[currentIndex].productName}/></div>
                        </div>
                    </div>
                    <div className='buttons_container_2'>
                        <button className='mod_button' id='accept_button' onClick={handleAccept}>Approve</button>
                        <button className='mod_button' id='delete_button' onClick={handleDelete}>Disapprove</button>
                    </div>
                </div>
            ) : (
                <p className='no_uninspected'>No unapproved products left.</p>
            )}
        </div>
    );
};

export default ApproveNewProducts;
