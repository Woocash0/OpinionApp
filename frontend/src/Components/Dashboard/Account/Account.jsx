import React from 'react';
import { useNavigate } from 'react-router-dom'; // Używamy do przekierowania
import { useEffect, useState } from 'react';
import { useSignOut } from 'react-auth-kit';
import axios from 'axios';
import { motion } from "framer-motion";
import {toast} from "react-hot-toast";
import Loading from '../../Loading'

const Account = () => {
  const signOut = useSignOut();
  const [userDetails, setUserDetails] = useState(null); // Inicjalizujemy stan danych użytkownika
  const navigate = useNavigate(); // Inicjalizujemy narzędzie do przekierowania

  useEffect(() => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0] === '_auth');
    // Pobranie danych o kategoriach z serwera
    axios.get('http://localhost:8000/account', {
      headers: {
        'Authorization': `Bearer ${authToken[1]}`
      }
    })
        .then(response => {
            console.log(response);
            setUserDetails(response.data.user);
        })
        .catch(error => {
            console.log(error);
            console.log("No user data found. Redirecting to login.");
            toast.error(error.response.data.message);
            signOut();
            navigate('/loginform');
        });
}, [navigate]);
   // Pobieramy dane użytkownika z localStorage podczas inicjalizacji komponentu
   
  // Lokalna metoda do wylogowania
  const onLogout = (e) => {
    e.preventDefault(); // Zapobiega domyślnemu działaniu formularza
    signOut();
    navigate('/loginform');
    toast.success("Logout successful"); // Przekieruj do logowania po wylogowaniu
  };

  if (!userDetails) {
    return <Loading />
  }

  return (
    <motion.div
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    exit={{ opacity: 0}}
    transition={{ duration: 1.3}}>
    <div>

      <header>My account</header>
      <div id="info">
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
          <div className="detail">************</div> {/* Maskowane hasło */}
          <div className="detail_name">Password</div>
        </div>

        <div className="detail_container">
          {/* Formularz wylogowania */}
          <form
            className="login"
            onSubmit={onLogout} // Używamy lokalnej metody do obsługi wylogowania
          >
            <button type="submit" id="sign">SIGN OUT</button>
          </form>
        </div>
      </div>
    </div>
    </motion.div>);
};

export default Account;
