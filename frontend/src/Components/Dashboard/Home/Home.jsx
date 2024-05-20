import React, { useState, useEffect } from 'react';
import CategoryTree from './CategoryTree'
import Products from './Products'



const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  console.log("HOME:", selectedCategory);

  return (
    <>
      <CategoryTree onSelectCategory={setSelectedCategory}/>
      <Products selectedCategory={selectedCategory} />
    </>
  );
};

export default Home
