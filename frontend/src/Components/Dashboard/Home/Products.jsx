import React from 'react'



const Products = ({ selectedCategory }) => {
    console.log("PRODUCTS:", selectedCategory);
    const allProducts = [
        { id: 1, name: 'Product 1', category: 1 },
        { id: 2, name: 'Product 2', category: 2 },
        { id: 3, name: 'Product 3', category: 3 },
        { id: 4, name: 'Product 4', category: 4 },
        { id: 5, name: 'Product 5', category: 5 },
        { id: 6, name: 'Product 6', category: 6 },
        { id: 7, name: 'Product 7', category: 7 },
        { id: 8, name: 'Product 8', category: 8 },
        { id: 9, name: 'Product 9', category: 9 },
        { id: 10, name: 'Product 10', category: 10 },
        { id: 11, name: 'Product 11', category: 11 },
        { id: 12, name: 'Product 12', category: 12 },
        { id: 13, name: 'Product 13', category: 13 },
        { id: 14, name: 'Product 14', category: 14 },
        { id: 15, name: 'Product 15', category: 15 },
        { id: 16, name: 'Product 16', category: 16 },
      ]; 

    const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;


  return (
    <div>
      <h2>Products</h2>
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Products
