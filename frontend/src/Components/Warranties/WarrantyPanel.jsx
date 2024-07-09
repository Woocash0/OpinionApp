import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPenToSquare, faTrash, faReceipt } from '@fortawesome/free-solid-svg-icons';
import NoImage from '../../Images/receiptImages/no-image.png';
import "./warrantyPanel.css";
import { motion } from "framer-motion";


const WarrantyPanel = ({ selectedWarranty, onClose }) => {
  if (!selectedWarranty) {
    return null;
  }
  
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
>
      <div className="notification-overlay" style={{ display: 'block' }} onClick={onClose}></div>
      <div className="notification-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        {selectedWarranty && (
        <div className='productHeader'>
            <header className='product-header-one'>{selectedWarranty.productName}</header>
            <header className='product-header-two'>{selectedWarranty.category}</header>   
        </div>
        )}
        <div className="productInfo" style={{ display: 'flex' }}>
          <div id="clock">
            <div className="exit" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} className="steady" />
            </div>
             
            <div className="edit">
              <FontAwesomeIcon icon={faPenToSquare} className="steady" />
            </div>
            
            <div id="elipse">
            {selectedWarranty ? (
                <div id="detail_receipt">
                    <img src={require(`../../Images/receiptImages/${selectedWarranty.receipt}`)}  alt={selectedWarranty.receipt} />
                  
                </div>
              ) : (
                <>
                  <div id="detail_receipt">
                    <img src={NoImage} alt="No image" />
                  </div>
                </>
              )}
            </div>
            
            <div className="delete">
              <FontAwesomeIcon icon={faTrash} className="steady" />
            </div>
            <div className="location">
              <FontAwesomeIcon icon={faReceipt} className="steady" />
            </div>
            
          </div>
          {selectedWarranty && (
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
                    <div class="detail" id="detail_warranty_period">{selectedWarranty.warrantPeriod}</div>
                    <div class="detail_name">Warranty Period</div>
                </div>
                <div class="detail_container">
                    <div class="detail" id="detail_tags">{selectedWarranty.tags}</div>
                    <div class="detail_name">Tags</div>
                </div>
            </div>
          )}
          </div>
      </div>
      </motion.div>
  );
};

export default WarrantyPanel;
