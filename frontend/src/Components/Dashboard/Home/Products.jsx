import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddButton from '../../images/add_button.svg';
import SearchNavItem from './SearchNavItem';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { toast } from 'react-hot-toast';

const Products = ({ selectedCategory, selectedCategoryName, onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const auth = useAuthUser();
    const navigate = useNavigate();

    const handleClick = () => {
        const user = auth();
        if (user) {
          navigate('/add_product');
        } else {
          toast.error('Login to add products', {
            className: 'react-hot-toast',
          });
        }
      };

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
                    <img
      src={AddButton}
      alt="Add Product"
      onClick={handleClick}
      className="add_product_button"
      style={{ cursor: 'pointer' }} // Dodaje wskazanie kursora do kliknięcia
    />
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
