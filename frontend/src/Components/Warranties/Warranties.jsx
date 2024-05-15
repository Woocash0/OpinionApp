import React from 'react';
import { Link } from 'react-router-dom'; // Używamy do linków React
import { format } from 'date-fns'; // Używamy do formatowania daty

const Warranties = ({ warranties }) => {
  return (
    <div>
      {/* Dodaj przycisk do dodawania gwarancji */}
      <Link to="/add_warranty" className="add_button">
        <img src="/img/add_button.svg" alt="Add Warranty" />
      </Link>

      {/* Nagłówek z liczbą gwarancji */}
      <header>Active warranties</header>

      {/* Sekcja z listą gwarancji */}
      <section className="warranties">
        
      </section>
    </div>
  );
};

export default Warranties;
