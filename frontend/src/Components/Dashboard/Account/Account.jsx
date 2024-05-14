import React from 'react';
import { useNavigate } from 'react-router-dom'; // Używamy do przekierowania
import { useEffect, useState } from 'react';

const Account = () => {
  const [userDetails, setUserDetails] = useState(null); // Inicjalizujemy stan danych użytkownika
  const navigate = useNavigate(); // Inicjalizujemy narzędzie do przekierowania


   // Pobieramy dane użytkownika z localStorage podczas inicjalizacji komponentu
   useEffect(() => {
    const userDataJson = localStorage.getItem('user_data'); // Pobierz dane z localStorage
    if (userDataJson) {
      const userData = JSON.parse(userDataJson); // Przekształć na obiekt
      setUserDetails(userData); // Ustaw dane użytkownika w stanie
    } else {
      console.log("No user data found. Redirecting to login.");
      navigate('/loginform'); // Jeśli nie ma danych, przekieruj do logowania
    }
  }, [navigate]); // Zależność od navigate, by unikać błędów
  // Lokalna metoda do wylogowania
  const onLogout = (e) => {
    e.preventDefault(); // Zapobiega domyślnemu działaniu formularza
    
    // Usuń token JWT z localStorage lub sessionStorage
    localStorage.removeItem('jwt_token'); // Możesz też użyć sessionStorage
    localStorage.removeItem('user_data');
    
    // Przekieruj do strony logowania lub innej
    navigate('/loginform'); // Przekieruj do logowania po wylogowaniu
  };

  if (!userDetails) {
    // Jeśli dane użytkownika nie są załadowane, zwróć coś innego (np. loader)
    return <div>Loading...</div>;
  }

  return (
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
  );
};

export default Account;
