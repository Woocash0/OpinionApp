import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPenToSquare, faTrash, faReceipt } from '@fortawesome/free-solid-svg-icons'; // Import ikon Font Awesome

const Notification = () => {
  return (
    <div>
      <div className="notification-overlay"></div> {/* Overlay element */}
      <div className="notification-panel"> {/* Panel zawierający wszystkie elementy */}
        <div id="clock"> {/* Zegar lub inne informacje */}
          <div className="exit">
            <FontAwesomeIcon icon={faXmark} className="fa-beat" /> {/* Ikona z animacją */}
          </div>
          <div className="edit">
            <FontAwesomeIcon icon={faPenToSquare} className="fa-bounce" />
          </div>
          <div id="elipse"> {/* Część ze szczegółami */}
            <div className="timebox"><b></b>&nbsp; dni</div> {/* Upewnij się, że dane są uzupełnione */}
            <div className="timebox"><b></b>&nbsp; godzin</div>
            <div className="timebox"><b></b>&nbsp; minut</div>
            <div className="timebox"><b></b>&nbsp; sekund</div>
          </div>
          <div className="delete">
            <FontAwesomeIcon icon={faTrash} className="fa-bounce" />
          </div>
          <div className="location">
            <FontAwesomeIcon icon={faReceipt} className="fa-bounce" />
          </div>
        </div>
        <div id="info"> {/* Sekcja z dodatkowymi informacjami */}
          <div className="detail_container">
            <div className="detail" id="detail_category"></div> {/* Tutaj powinny być uzupełnione dane */}
            <div className="detail_name">Category</div>
          </div>
          <div className="detail_container">
            <div className="detail" id="detail_product_name"></div>
            <div className="detail_name">Product Name</div>
          </div>
          <div className="detail_container">
            <div className="detail" id="detail_purchase_date"></div>
            <div className="detail_name">Purchase Date</div>
          </div>
          <div className="detail_container">
            <div className="detail" id="detail_warranty_period"></div>
            <div className="detail_name">Warranty Period</div>
          </div>
          <div className="detail_container">
            <div className="detail" id="detail_tags"></div>
            <div className="detail_name">Tags</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
