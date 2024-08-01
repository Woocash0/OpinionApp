import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddButton from '../../images/add_button.svg';
import SearchNavItem from './SearchNavItem';

const Products = ({ selectedCategory, selectedCategoryName, onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/products')
            .then(response => { 
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleSearchResults = (results) => {
        setSearchedProducts(results);
    };

    const handleShowSearch = () => {
        setIsSearching(true);
    };

    const handleClearSearch = () => {
        setIsSearching(false);
    };

    const filteredProducts = (selectedCategory
        ? products.filter(product => product.categoryId === selectedCategory)
        : products);

    const showProducts = isSearching ? searchedProducts : filteredProducts;

    return (
        <>
            <div className='header_container'>
                <header>
                  {isSearching ? ('Searching:') : (selectedCategoryName ? `Products: ${selectedCategoryName}` : "Products")}
                </header>
                <span className='search_add'>
                    <SearchNavItem 
                        products={products}
                        onSearchResults={handleSearchResults}
                        onClearSearch={handleClearSearch}
                        onShowSearch={handleShowSearch}
                    />
                    <Link to="/add_product" className="add_product_button">
                        <img src={AddButton} alt="Add Product" />
                    </Link>
                </span>
            </div>
            
            <section className="warranties">
                {showProducts.map(product => (
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
        </>
    );
};

export default Products;
