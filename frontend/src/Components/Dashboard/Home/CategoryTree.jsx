import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./categoryTree.css";


const Category = ({ category, onClick }) => (
    <li key={category.id} onClick={onClick}>
        {category.name}
    </li>
);

const SubCategory = ({ category, activeCategoryId, setActiveCategoryId }) => (
    <div key={`sub-cat-${category.id}`} className={`sub-category-list ${activeCategoryId === category.id ? 'show' : ''}`}>
        {activeCategoryId === category.id &&
            <>
                <button className="close" onClick={() => setActiveCategoryId(null)}>Zamknij</button>
                <ul>
                    {category.children.map(child => (
                        <li key={child.id}>{child.name}</li>
                    ))}
                </ul>
            </>
        }
    </div>
);

const ThirdLevelCategory = ({ category, toggleThirdSubCategory, isActive }) => (
    <div key={`third-cat-${category.id}`} className={`third-level-category ${isActive ? 'active' : ''}`}>
        <ul>
            {category.children.map(grandchild => (
                <li key={grandchild.id} onClick={() => toggleThirdSubCategory(grandchild.id, grandchild.name)}>
                    {grandchild.name}
                </li>
            ))}
        </ul>
    </div>
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
                <div className="main-categories">
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
                        <div key={`third-cat-${category.id}`} className={`third-level-category-list ${activeCategoryId === category.id ? 'show' : ''}`}>
                            {activeCategoryId === category.id && category.children.map(child => (
                                <div key={`third-cat-${child.id}`} className={`third-level-category ${activeSubCategoryId === child.id ? 'active' : ''}`}>
                                    {console.log('thirdLevelCategory:', child)} {/* Dodaj ten console.log */}
                                    {activeSubCategoryId === child.id && (
                                        <ThirdLevelCategory
                                            category={child}
                                            toggleThirdSubCategory={toggleThirdSubCategory}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CategoryTree;