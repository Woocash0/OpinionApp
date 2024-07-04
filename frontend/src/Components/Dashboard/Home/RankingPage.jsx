import React, { useState, useEffect } from 'react';
import CategoryTree from './CategoryTree'
import Products from './Products'
import ProductPanel from './ProductPanel';
import Ranking from './Ranking';



const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <CategoryTree onSelectCategory={setSelectedCategory} onSelectCategoryName={setSelectedCategoryName}/>
      <Ranking onSelectProduct={handleProductSelect} selectedCategory={selectedCategory} selectedCategoryName={selectedCategoryName} />
      <ProductPanel selectedProduct={selectedProduct} onClose={() => setSelectedProduct(null)}/>
    </>
  );
};

export default Home
