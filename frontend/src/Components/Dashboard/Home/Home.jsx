import React, { useState, useEffect } from 'react';
import CategoryTree from './CategoryTree'
import Products from './Products'



const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  return (
    <>
      <CategoryTree onSelectCategory={setSelectedCategory} onSelectCategoryName={setSelectedCategoryName}/>
      <Products selectedCategory={selectedCategory} selectedCategoryName={selectedCategoryName} />
    </>
  );
};

export default Home
