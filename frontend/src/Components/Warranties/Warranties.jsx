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
      <header>Active warranties ({warranties.length})</header>

      {/* Sekcja z listą gwarancji */}
      <section className="warranties">
        {warranties.map((warranty) => (
          <div className="warranty_box" key={warranty.id}>
            <img src={`/img/${warranty.category}.svg`} alt={warranty.category} /> {/* Ikona kategorii */}
            <div className="imgname">{warranty.category}</div>

            {/* Ukryte szczegóły gwarancji */}
            <div className="hidden_details" style={{ display: 'none' }}>
              <div id="productName">{warranty.productName}</div>
              <div id="purchaseDate">
                {format(new Date(warranty.purchaseDate), 'yyyy-MM-dd')} {/* Formatowanie daty */}
              </div>
              <div id="warrantyPeriod">{warranty.warrantyPeriod}</div>
              <div id="receipt">{warranty.receipt}</div>
              <div id="tags">
                {warranty.tags.map((tag) => (
                  <span key={tag.id}>{tag.name} </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Warranties;
