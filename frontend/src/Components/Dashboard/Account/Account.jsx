import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import axios from 'axios';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Loading from '../../Loading';

const infoStyle = {
    backgroundColor: 'unset',
    width: 'inherit',
    justifyContent: 'space-evenly',
    fontFamily: 'Inter'
};

const Account = () => {
   const signOut = useSignOut();
   const [userDetails, setUserDetails] = useState(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
      const authToken = cookies.find(cookie => cookie[0] === '_auth');

      axios.get('http://localhost:8000/account', {
        headers: {
          'Authorization': `Bearer ${authToken[1]}`
        }
      })
      .then(response => {
          setUserDetails(response.data.user);
      })
      .catch(error => {
          toast.error(error.response.data.message, {
            className: 'react-hot-toast',
          });
          signOut();
          navigate('/loginform');
      })
      .finally(() => {
          setLoading(false);
      });
  }, [navigate, signOut]);

  const onLogout = (e) => {
      e.preventDefault();
      signOut();
      navigate('/loginform');
      toast.success("Logout successful", {
        className: 'react-hot-toast',
      });
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
