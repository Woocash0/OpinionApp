import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPenToSquare, faTrash, faReceipt } from '@fortawesome/free-solid-svg-icons';
import NoImage from '../../Images/receiptImages/no-image.png';
import "./warrantyPanel.css";
import { motion } from "framer-motion";
import WarrantyTimer from './WarrantyTimer';
import { toast } from "react-hot-toast";
import axios from 'axios';


const WarrantyPanel = ({ selectedWarranty, onClose }) => {
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const authToken = cookies.find(cookie => cookie[0] === '_auth');

  if (!selectedWarranty) {
    return null;
  }
  const warrantyYears = selectedWarranty.warrantyPeriod === 1 ? 'year' : 'years';
  
  const toggleReceiptVisibility = () => {
    setIsReceiptVisible(!isReceiptVisible);

    const elipseContainer = document.getElementById('elipse');
      elipseContainer.style.border = isReceiptVisible ? '15px solid #261132' : 'none';
    
  };
  
  const handleClose = () => {
    onClose(); // Wywołanie przekazanej funkcji onClose
    setIsReceiptVisible(false); // Resetowanie stanu isReceiptVisible
  };

  

  const deleteWarranty = async () => {
    if (!selectedWarranty || isDeleting) return;

    setIsDeleting(true);

    try {
      await axios.delete(`http://localhost:8000/delete_warranty/${selectedWarranty.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken[1]}`
        }
      });
      toast.success('Warranty deleted successfully', {
        className: 'react-hot-toast',
      });
      onClose();
      setIsReceiptVisible(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting warranty:', error);
      toast.error('Failed to delete warranty', {
        className: 'react-hot-toast',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    >
      <div className="popup-overlay" style={{ display: 'block' }} onClick={handleClose}></div>
      <div className="warranty-popup-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className='productHeader'>
            <header className='product-header-one'>Remaining warranty:</header>
            <header className='product-header-two'>{selectedWarranty.category}</header>   
        </div>
        <div className="productInfo" style={{ display: 'flex' }}>
          <div id="clock">
            <div className="exit" onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} className="steady" />
            </div>
             
            <div className="edit">
              <FontAwesomeIcon icon={faPenToSquare} className="steady" />
            </div>
            
            <div id="elipse">
            {isReceiptVisible ? (
              <div id="detail_receipt">
                <img
                src={selectedWarranty ? require(`../../Images/receiptImages/${selectedWarranty.receipt}`) : NoImage}
                alt={selectedWarranty ? selectedWarranty.receipt : "No image"}
                />
              </div>
            ) : ( 
              <WarrantyTimer purchaseDate={selectedWarranty.purchaseDate} warrantyYears={selectedWarranty.warrantyPeriod} />
          )}
            </div>
            
            <div className={`delete ${isDeleting ? 'disabled' : ''}`} onClick={deleteWarranty}>
              <FontAwesomeIcon icon={faTrash} className="steady" />
            </div>
            <div className="location" onClick={toggleReceiptVisibility}>
              <FontAwesomeIcon icon={faReceipt} className="steady" />
            </div>
            
          </div>
            <div id="info">
                <div class="detail_container">
                    <div class="detail" id="detail_category">{selectedWarranty.category}</div>
                    <div class="detail_name">Category</div>
                </div>
                <div class="detail_container">
                    <div class="detail" id="detail_product_name">{selectedWarranty.productName}</div>
                    <div class="detail_name">Product Name</div>
                </div>
                <div class="detail_container">
                    <div class="detail" id="detail_purchase_date">{selectedWarranty.purchaseDate}</div>
                    <div class="detail_name">Purchase Date</div>
                </div>
                <div class="detail_container">
                    <div class="detail" id="detail_warranty_period">{selectedWarranty.warrantyPeriod} {warrantyYears}</div>
                    <div class="detail_name">Warranty Period</div>
                </div>
                <div class="detail_container">
                    <div class="detail" id="detail_tags">{selectedWarranty.tags}</div>
                    <div class="detail_name">Tags</div>
                </div>
            </div>
          </div>
      </div>
      </motion.div>
  );
};

export default WarrantyPanel;
