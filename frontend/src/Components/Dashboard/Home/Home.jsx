import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
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
      <Routes>
          <Route path="/" element={
            <Products 
              onSelectProduct={handleProductSelect} 
              selectedCategory={selectedCategory} 
              selectedCategoryName={selectedCategoryName} 
            />
          } />
          <Route path="ranking" element={
            <Ranking 
              onSelectProduct={handleProductSelect} 
              selectedCategory={selectedCategory} 
              selectedCategoryName={selectedCategoryName} 
            />
          } />
        </Routes>
      <ProductPanel selectedProduct={selectedProduct} onClose={() => setSelectedProduct(null)}/>
    </>
  );
};

export default Home
