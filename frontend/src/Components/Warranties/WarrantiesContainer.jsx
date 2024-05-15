import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Używamy axios do wysyłania żądań HTTP
import Warranties from './Warranties'; // Importujemy komponent Warranties
import { useNavigate } from 'react-router-dom'; // Narzędzie do przekierowania
import { RequireAuth, useAuthHeader } from "react-auth-kit";

const WarrantiesContainer = () => {
  const authHeader = useAuthHeader();
  const [warranties, setWarranties] = useState(null); // Inicjalizujemy stan jako null
  const [loading, setLoading] = useState(true); // Flaga ładowania
  const [error, setError] = useState(null); // Flaga błędu
  const navigate = useNavigate(); // Narzędzie do przekierowania

  useEffect(() => {
    // Pobierz wartość ciasteczka _auth
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const authToken = cookies.find(cookie => cookie[0] === '_auth');

    axios
      .get('http://localhost:8000/warranties', {
        headers: {
          'Authorization': `Bearer ${authToken[1]}`
        }
      }) // Endpoint z Symfony
      .then((response) => {
        console.log(response);
        setWarranties(response.data.warranties); // Ustaw dane po uzyskaniu odpowiedzi
        setLoading(false); // Ustaw flagę ładowania na false
      })
      .catch((err) => {
        console.error(err); // Wyświetl błąd w konsoli
        setError('Failed to load warranties.'); // Ustaw komunikat błędu
        setLoading(false); // Ustaw flagę ładowania na false
      });
  }, [authHeader]); // Upewnij się, że useEffect uruchamia się tylko raz (przy montażu)

  if (loading) {
    return <div>Loading warranties...</div>; // Komunikat podczas ładowania
  }

  if (error) {
    return <div>{error}</div>; // Komunikat w przypadku błędu
  }

  return <Warranties warranties={warranties} />; // Przekazujemy dane do komponentu Warranties
};

export default WarrantiesContainer;
