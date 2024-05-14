import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Używamy axios do wysyłania żądań HTTP
import Warranties from './Warranties'; // Importujemy komponent Warranties
import { useNavigate } from 'react-router-dom'; // Narzędzie do przekierowania

const WarrantiesContainer = () => {
  const [warranties, setWarranties] = useState(null); // Inicjalizujemy stan jako null
  const [loading, setLoading] = useState(true); // Flaga ładowania
  const [error, setError] = useState(null); // Flaga błędu
  const navigate = useNavigate(); // Narzędzie do przekierowania

  useEffect(() => {
    // Pobierz dane z endpointu Symfony
    axios
      .get('http://localhost:8000/warranties') // Endpoint z Symfony
      .then((response) => {
        setWarranties(response.data.warranties); // Ustaw dane po uzyskaniu odpowiedzi
        setLoading(false); // Ustaw flagę ładowania na false
      })
      .catch((err) => {
        console.error(err); // Wyświetl błąd w konsoli
        setError('Failed to load warranties.'); // Ustaw komunikat błędu
        setLoading(false); // Ustaw flagę ładowania na false
      });
  }, []); // Upewnij się, że useEffect uruchamia się tylko raz (przy montażu)

  if (loading) {
    return <div>Loading warranties...</div>; // Komunikat podczas ładowania
  }

  if (error) {
    return <div>{error}</div>; // Komunikat w przypadku błędu
  }

  return <Warranties warranties={warranties} />; // Przekazujemy dane do komponentu Warranties
};

export default WarrantiesContainer;
