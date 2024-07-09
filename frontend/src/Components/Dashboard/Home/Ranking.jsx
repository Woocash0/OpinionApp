import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ranking.css";

const calculateAverageRating = (opinions, ratingType) => {
    if (!opinions || opinions.length === 0) return null;

    // Filtrowanie opinii, które mają null jako ratingType
    const validOpinions = opinions.filter(opinion => opinion[ratingType] !== null);

    if (validOpinions.length === 0) return null;

    const total = validOpinions.reduce((acc, opinion) => acc + opinion[ratingType], 0);
    return (total / validOpinions.length).toFixed(1);
};

const Ranking = ({ selectedCategory, selectedCategoryName, onSelectProduct }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/products')
            .then(response => { 
                const productsWithRatings = response.data.map(product => {
                    const opinions = product.opinions || [];

                     const durabilityRating = calculateAverageRating(opinions, 'durability_rating');
                     const designRating = calculateAverageRating(opinions, 'design_rating');
                     const priceRating = calculateAverageRating(opinions, 'price_rating');
                     const capabilitiesRating = calculateAverageRating(opinions, 'capabilities_rating');
 
                     const ratings = [durabilityRating, designRating, priceRating, capabilitiesRating].filter(rating => rating !== null);
                     const averageRating = ratings.length > 0 ? (ratings.reduce((acc, rating) => acc + parseFloat(rating), 0) / ratings.length).toFixed(2) : null;
 
                     return { ...product, averageRating };
                });

                setProducts(productsWithRatings);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.categoryId === selectedCategory)
        : products;

    const sortedFilteredProducts = filteredProducts.sort((a, b) => b.averageRating - a.averageRating);

    return (
        <>
            <header>{selectedCategoryName ? `Ranking: ${selectedCategoryName}` : "Ranking"}</header>
            <div className="ranking-panel">
                {sortedFilteredProducts.map((product, index) => (
                    <div className="rank-box" key={product.id}  onClick={() => onSelectProduct(product)}>
                        <div className='rank-place'>{index + 1}</div>
                        <img className='rank-image' src={require(`../../../Images/productImages/${product.image}`)} alt={product.productName} />
                        <div className="rank-product-name">{product.productName}</div>
                        <div className="rank-average-rating">{product.averageRating ? product.averageRating : "X" }</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Ranking;
