import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = ({ selectedCategory, selectedCategoryName, onSelectProduct }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/products')
            .then(response => { 
                setProducts(response.data);
                console.log("Products ", response.data)
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);


    const filteredProducts = selectedCategory
        ? products.filter(product => product.categoryId === selectedCategory)
        : products;

    return (
        <div>
            <header>{selectedCategoryName ? `Produkty: ${selectedCategoryName}` : "Produkty"}</header>
            <section className="warranties">
                {filteredProducts.map(product => (
                    <div className="warranty_box" key={product.id} onClick={() => onSelectProduct(product)}>
                        <img src={require(`../../../Images/productImages/${product.image}`)} alt={product.productName} />
                        <div className="imgname">{product.productName}</div>
                        <div className="hidden_details" style={{ display: 'none' }}>
                            <div id="description">{product.description}</div>
                            <div id="producer">{product.producer}</div>
                            <div id="barcode">{product.barcode}</div>
                            <div id="category">{product.categoryName}</div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Products;
