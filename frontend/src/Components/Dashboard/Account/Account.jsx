import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Loading from '../../Loading';
import useRefreshToken from '../../../hooks/useRefreshToken';

const infoStyle = {
  backgroundColor: 'unset',
  width: 'inherit',
  justifyContent: 'space-evenly',
  fontFamily: 'Inter'
};

const Account = () => {
  const signOut = useSignOut();
  const [userDetails, setUserDetails] = useState(null);
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const refreshToken = useRefreshToken(); // Hook do odświeżania tokenu

  useEffect(() => {
    const fetchUserDetails = () => {
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

      axios.get('http://localhost:8000/account', {
        headers: {
          'Authorization': `Bearer ${authToken[1]}`
        }
      })
      .then(response => {
        setUserDetails(response.data.user);
        setRoles(response.data.user.roles);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          toast.promise(
            refreshToken(),
             {
               loading: 'Saving...',
               success: <b>Settings saved!</b>,
               error: <b>Could not save.</b>,
             }, {
              className: 'react-hot-toast',
            });
          refreshToken()
            .then(newAuthToken => {
              if (newAuthToken) {
                return axios.get('http://localhost:8000/account', {
                  headers: {
                    'Authorization': `Bearer ${newAuthToken}`
                  }
                });
              } else {
                throw new Error('Failed to refresh token');
              }
            })
            .then(response => {
              setUserDetails(response.data.user);
              setRoles(response.data.user.roles);
              setLoading(false);
            })
            .catch(refreshError => {
              signOut();
              navigate('/loginform');
              toast.error('Session expired. Please log in again.', {
                className: 'react-hot-toast',
              });
              setLoading(false);
            });
        } else {
          signOut();
          navigate('/loginform');
          toast.error(error.response ? error.response.data.message : 'An error occurred', {
            className: 'react-hot-toast',
          });
          setLoading(false);
        }
      });
    };

    fetchUserDetails();
  }, []);

  if (loading) return <Loading/>
  if (!userDetails) return <div>Error loading user details</div>;

  const onLogout = (e) => {
    e.preventDefault();
    signOut();
    navigate('/loginform');
    toast.success("Logout successful", {
      className: 'react-hot-toast',
    });
  };

    const extractRole = (roles) => {
      const match = roles.match(/(?<=_).+/);
      const extractedRole =  match ? match[0] : '';
      return extractedRole.charAt(0).toUpperCase() + extractedRole.slice(1).toLowerCase();
    };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <div>
        <header>My account</header>
        <div id="info" style={infoStyle}>
          {loading ? (
            <Loading />
          ) : (
            userDetails && (
              <>
                <div className="detail_container">
                  <div className="detail">{roles.map((role, index) => (
                      <span key={index}>{extractRole(role)}&nbsp;</span>
                  ))}</div>
                  <div className="detail_name">Role</div>
                </div>
                <div className="detail_container">
                  <div className="detail">{userDetails.name}</div>
                  <div className="detail_name">Name</div>
                </div>
                <div className="detail_container">
                  <div className="detail">{userDetails.surname}</div>
                  <div className="detail_name">Surname</div>
                </div>
                <div className="detail_container">
                  <div className="detail">{userDetails.email}</div>
                  <div className="detail_name">Email</div>
                </div>
                <div className="detail_container">
                  <div className="detail">************</div>
                  <div className="detail_name">Password</div>
                </div>
                <div className="detail_container">
                  <form
                    className="login"
                    onSubmit={onLogout}
                  >
                    <button type="submit" id="sign">SIGN OUT</button>
                  </form>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Account;
