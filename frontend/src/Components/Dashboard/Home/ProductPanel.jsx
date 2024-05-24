import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPenToSquare, faTrash, faReceipt } from '@fortawesome/free-solid-svg-icons';
import Barcode from 'react-barcode';
import NoImage from '../../../Images/no-image.png';
import "./productPanel.css";
import OpinionContainer from './OpinionContainer';



const ProductPanel = ({ selectedProduct, onClose }) => {
  const existingOpinions = selectedProduct ? selectedProduct.opinions : [];
  if (!selectedProduct) {
    return null;
  }

  const calculateAverageRating = (opinions, ratingType) => {
    if (!opinions || opinions.length === 0) return 0;

    const total = opinions.reduce((acc, opinion) => acc + opinion[ratingType], 0);
    return (total / opinions.length).toFixed(1);
};

  return (
    <>
      <div className="notification-overlay" style={{ display: 'block' }} onClick={onClose}></div>
      <div className="notification-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        {selectedProduct && (
        <div className='productHeader'>
            <header className='product-header-one'>{selectedProduct.productName}</header>
            <header className='product-header-two'>{selectedProduct.producer}</header>   
        </div>
        )}
        <div className="productInfo" style={{ display: 'flex' }}>
          <div id="clock">
            <div className="exit" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} className="steady" />
            </div>
            {/* 
            <div className="edit">
              <FontAwesomeIcon icon={faPenToSquare} className="steady" />
            </div>
            */}
            <div id="elipse">
            {selectedProduct ? (
                <div id="detail_receipt">
                  <img src={require(`../../../Images/productImages/${selectedProduct.image}`)} alt={selectedProduct.productName} />
                </div>
              ) : (
                <>
                  <div id="detail_receipt">
                    <img src={NoImage} alt="No image" />
                  </div>
                </>
              )}
            </div>
            {/* 
            <div className="delete">
              <FontAwesomeIcon icon={faTrash} className="steady" />
            </div>
            <div className="location">
              <FontAwesomeIcon icon={faReceipt} className="steady" />
            </div>
            */}
          </div>
          {selectedProduct && (
            <div id="info">
              <div className="detail_container" id='detail_description_container'>
                <div className="detail" id="detail_description">{selectedProduct.description}</div>
                <div className="detail_name" id='detail_description_name'>Description</div>
              </div>
              <div className='product_ratings'>
                <div className="detail_container">
                  <div className="detail" id="detail_rating">{calculateAverageRating(selectedProduct.opinions, 'rating')}</div>
                  <div className="detail_name">Overall</div>
                </div>
                <div className="detail_container">
                  <div className="detail" id="detail_rating">{calculateAverageRating(selectedProduct.opinions, 'durability_rating')}</div>
                  <div className="detail_name">Durability</div>
                </div>
                <div className="detail_container">
                  <div className="detail" id="detail_rating">{calculateAverageRating(selectedProduct.opinions, 'price_rating')}</div>
                  <div className="detail_name">Price</div>
                </div>
                <div className="detail_container">
                  <div className="detail" id="detail_rating">{calculateAverageRating(selectedProduct.opinions, 'capabilities_rating')}</div>
                  <div className="detail_name">Capabilities</div>
                </div>
                <div className="detail_container">
                  <div className="detail" id="detail_rating">{calculateAverageRating(selectedProduct.opinions, 'design_rating')}</div>
                  <div className="detail_name">Design</div>
                </div>
              </div>
              <div className="detail_container">
                <div className="detail" id="detail_barcode"><Barcode value={selectedProduct.barcode}  height={60} width={6} fontSize={20} /></div>
                <div className="detail_name">EAN/GTIN</div>
              </div>


            </div>
          )}
          </div>
          <OpinionContainer existingOpinions={existingOpinions} productId={selectedProduct.id} />
      </div>
      </>
  );
};

export default ProductPanel;
