import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import "./categoryTree.css";


const Category = ({ category, onClick }) => (
    <li key={category.id} onClick={onClick}>
        {category.name}
    </li>
);


const ThirdLevelCategory = ({ category, toggleThirdSubCategory, activeThirdLevelCategoryId }) => (
    <>
        {category.children.map(grandchild => (
            <li
                key={`third-cat-${grandchild.id}`}
                className={`third-level-category ${activeThirdLevelCategoryId === grandchild.id ? 'active' : ''}`}
                onClick={() => toggleThirdSubCategory(grandchild.id, grandchild.name)}
            >
                {grandchild.name}
            </li>
        ))}
    </>
);

const CategoryTree = ({ onSelectCategory, onSelectCategoryName }) => {
    const [rootCategories, setRootCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);
    const [activeThirdLevelCategoryId, setActiveThirdLevelCategoryId] = useState(null);

    const handleClick = (categoryId, categoryName) => {
        onSelectCategory(categoryId);
        onSelectCategoryName(categoryName);
    };

    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Prędkość przewijania
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };


    useEffect(() => {
        axios.get('http://localhost:8000/categories')
            .then(response => {
                console.log(response);
                setRootCategories(response.data);
            })
            .catch(error => {
                console.error('Błąd pobierania danych o kategoriach:', error);
            });
    }, []);

    const toggleMainCategory = (categoryId, categoryName) => {
        handleClick(categoryId, categoryName);
        setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
        setActiveSubCategoryId(null);
        setActiveThirdLevelCategoryId(null);
    };

    const toggleSubCategory = (categoryId, categoryName) => {
        handleClick(categoryId, categoryName);
        setActiveSubCategoryId(activeSubCategoryId === categoryId ? null : categoryId);
        setActiveThirdLevelCategoryId(null);
    };

    const toggleThirdSubCategory = (categoryId, categoryName) => {
        handleClick(categoryId, categoryName);
        setActiveThirdLevelCategoryId(activeThirdLevelCategoryId === categoryId ? null : categoryId);
    };

    return (
        <>
            <div className="category-container">
                <div className="main-categories" 
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}>
                    
                    <ul>
                        {rootCategories.map(category => (
                            <li
                                key={category.id}
                                className={`main-category ${activeCategoryId === category.id ? 'active' : ''}`}
                                onClick={() => toggleMainCategory(category.id, category.name)}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="sub-categories">
                    {rootCategories.map(category => (
                        <div key={`sub-cat-${category.id}`} className={`sub-category-list ${activeCategoryId === category.id ? 'show' : ''}`}>
                            {activeCategoryId === category.id && category.children.map(child => (
                                <div key={`sub-cat-${child.id}`} className={`sub-category ${activeSubCategoryId === child.id ? 'active' : ''}`}>
                                    <Category category={child} onClick={() => toggleSubCategory(child.id, child.name)} />
                                    {activeSubCategoryId === child.id}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="third-level-categories">
                {rootCategories.map(category => (
                    activeCategoryId === category.id && category.children.map(child => (
                        activeSubCategoryId === child.id && (
                            <div key={`third-cat-${child.id}`} className={`third-level-category-list show`}>
                                <ThirdLevelCategory
                                    category={child}
                                    toggleThirdSubCategory={toggleThirdSubCategory}
                                    activeThirdLevelCategoryId={activeThirdLevelCategoryId}
                                />
                            </div>
                        )
                    ))
                ))}
            </div>
            </div>
        </>
    );
};

export default CategoryTree;