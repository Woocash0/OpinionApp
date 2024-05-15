import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Category = ({ category, onClick }) => (
    <li key={category.id} onClick={onClick}>
        {category.name}
    </li>
);

const SubCategory = ({ category, activeCategoryId, setActiveCategoryId }) => (
    <div key={`sub-cat-${category.id}`} className={`sub-category-list ${activeCategoryId === category.id ? '' : 'hidden'}`}>
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

const ThirdLevelCategory = ({ category }) => (
    <div key={`third-cat-${category.id}`} className="third-level-category">
        <ul>
            {category.children.map(grandchild => (
                <li key={grandchild.id}>{grandchild.name}</li>
            ))}
        </ul>
    </div>
);

const CategoryTree = () => {
    const [rootCategories, setRootCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);

    useEffect(() => {
        // Pobranie danych o kategoriach z serwera
        axios.get('http://localhost:8000/categories')
            .then(response => {
                console.log(response);
                setRootCategories(response.data);
            })
            .catch(error => {
                console.error('Błąd pobierania danych o kategoriach:', error);
            });
    }, []); // Pusta tablica jako drugi argument, aby efekt został uruchomiony tylko raz po załadowaniu komponentu

    const toggleMainCategory = (categoryId) => {
        setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
        setActiveSubCategoryId(null); // Zresetuj wybrany trzeci poziom zagnieżdżenia
    };

    const toggleSubCategory = (categoryId) => {
        setActiveSubCategoryId(activeSubCategoryId === categoryId ? null : categoryId);
    };

    return (
        <div>
            <h1>Drzewo Kategorii</h1>
            <div className="container">
                <div className="main-categories">
                    <ul>
                        {rootCategories.map(category => (
                            <li
                                key={category.id}
                                className={`main-category ${activeCategoryId === category.id ? 'active' : ''}`}
                                onClick={() => toggleMainCategory(category.id)}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="sub-categories">
                    {rootCategories.map(category => (
                        <div key={`sub-cat-${category.id}`} className={`sub-category-list ${activeCategoryId === category.id ? '' : 'hidden'}`}>
                            {activeCategoryId === category.id && category.children.map(child => (
                                <div key={`sub-cat-${child.id}`} className={`sub-category ${activeSubCategoryId === child.id ? 'active' : ''}`}>
                                    <Category category={child} onClick={() => toggleSubCategory(child.id)} />
                                    {activeSubCategoryId === child.id }
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="third-level-categories">
                    {rootCategories.map(category => (
                        <div key={`third-cat-${category.id}`} className={`third-level-category-list ${activeCategoryId === category.id ? '' : 'hidden'}`}>
                            {activeCategoryId === category.id && category.children.map(child => (
                                <div key={`third-cat-${child.id}`} className={`third-level-category ${activeSubCategoryId === child.id ? 'active' : ''}`}>
                                    {activeSubCategoryId === child.id && (
                                        <ThirdLevelCategory category={child} />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryTree;
