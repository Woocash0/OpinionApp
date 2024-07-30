import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Dashboard/Home/addProduct.css";
import "./addWarranty.css";
import Autosuggest from 'react-autosuggest';
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading';

const getSuggestions = (value, products) => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : products.filter(product =>
        product.productName.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const renderSuggestion = suggestion => (
    <div className="react-autosuggest__suggestion">
        {suggestion.productName}
    </div>
);

const renderSuggestionsContainer = ({ containerProps, children }) => (
    <div {...containerProps} className="react-autosuggest__suggestions-container">
        <div className="react-autosuggest__suggestions-header">
            Product name suggestions
        </div>
        {children}
    </div>
);

function EditWarranty() {
    const [formData, setFormData] = useState({
        categoryId: '',
        subcategoryId: '',
        subsubcategoryId: '',
        productName: '',
        purchase_date: '',
        warranty_period: '',
        user_id: '',
        receipt: null
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subsubcategories, setSubsubcategories] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { warrantyId } = useParams(); // Get the warranty ID from the URL params

    useEffect(() => {
        // Fetch categories
        axios.get('http://localhost:8000/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        // Fetch products
        axios.get('http://localhost:8000/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });

            axios.get(`http://localhost:8000/warranty/${warrantyId}`, {
                headers: {
                  'Authorization': `Bearer ${document.cookie.split(';').map(cookie => cookie.trim().split('=')).find(cookie => cookie[0] === '_auth')[1]}`
                }
              })
            .then(response => {
                const warranty = response.data;
                setFormData({
                    categoryId: warranty.categoryId || '',
                    subcategoryId: warranty.subcategoryId || '',
                    subsubcategoryId: warranty.subsubcategoryId || '',
                    productName: warranty.productName || '',
                    purchase_date: warranty.purchase_date || '',
                    warranty_period: warranty.warranty_period || '',
                    user_id: warranty.user_id || '',
                    receipt: null
                });
                setValue(warranty.productName || '');
                setLoading(false);
                console.log(formData);
            })
            .catch(error => {
                console.error('Error fetching warranty:', error);
            });
    }, [warrantyId]);

    useEffect(() => {
        const { categoryId, subcategoryId, subsubcategoryId } = formData;
        const chosenCategory = subsubcategoryId || subcategoryId || categoryId;
        const filtered = products.filter(product => {
            return (!parseInt(chosenCategory) || parseInt(product.categoryId) === parseInt(chosenCategory));
        });

        setFilteredProducts(filtered);
    }, [formData, products]);

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value, filteredProducts));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
        setFormData({ ...formData, productName: suggestion.productName });
        setValue(suggestion.productName);
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setFormData({ ...formData, categoryId, subcategoryId: '', subsubcategoryId: '' });

        const selectedCategory = categories.find(category => category.id === parseInt(categoryId));
        if (selectedCategory) {
            setSubcategories(selectedCategory.children || []);
            setSubsubcategories([]);
        } else {
            setSubcategories([]);
            setSubsubcategories([]);
        }
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setFormData({ ...formData, subcategoryId, subsubcategoryId: '' });

        const selectedSubcategory = subcategories.find(subcategory => subcategory.id === parseInt(subcategoryId));
        if (selectedSubcategory) {
            setSubsubcategories(selectedSubcategory.children || []);
        } else {
            setSubsubcategories([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, receipt: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                formDataToSend.append(key, value);
                console.log(key, value);
            }
        });
        console.log("Data to edit ", formDataToSend);
        axios.post(`http://localhost:8000/edit_warranty/${warrantyId}`, formDataToSend, {
            headers: {
                'Authorization': `Bearer ${document.cookie.split(';').map(cookie => cookie.trim().split('=')).find(cookie => cookie[0] === '_auth')[1]}`
            }
        })
        .then(response => {
            toast.success('Warranty updated successfully', {
                className: 'react-hot-toast',
            });
            navigate('/warranties');
        })
        .catch(error => {
            if (error.response.data) {
                toast.error(error.response.data.error + ", Check if this warranty already exists", {
                    className: 'react-hot-toast',
                });
            } else {
                toast.error('Error updating warranty', {
                    className: 'react-hot-toast',
                });
            }
        });
    };

    if (loading) {
        return <Loading />;
    }

    const inputProps = {
        placeholder: 'Product Name',
        value,
        onChange: onChange
    };

    return (
        <>
            <header>Edit Warranty</header>
            <form onSubmit={handleSubmit}>
                <div className="warranty_add_form">
                    <div className="detail_container">
                        <select name="categoryId" className="detail" value={formData.categoryId} onChange={handleCategoryChange}>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <div className="detail_name">Category</div>
                    </div>
                    {subcategories.length > 0 && (
                        <div className="detail_container">
                            <select name="subcategoryId" className="detail" value={formData.subcategoryId} onChange={handleSubcategoryChange}>
                                <option value="">Select Subcategory</option>
                                {subcategories.map(subcategory => (
                                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                ))}
                            </select>
                            <div className="detail_name">Subcategory</div>
                        </div>
                    )}
                    {subsubcategories.length > 0 && (
                        <div className="detail_container">
                            <select name="subsubcategoryId" className="detail" value={formData.subsubcategoryId} onChange={handleChange}>
                                <option value="">Select Sub-Subcategory</option>
                                {subsubcategories.map(subsubcategory => (
                                    <option key={subsubcategory.id} value={subsubcategory.id}>{subsubcategory.name}</option>
                                ))}
                            </select>
                            <div className="detail_name">Sub-Subcategory</div>
                        </div>
                    )}
                    <div className="detail_container">
                        <span className='suggest'>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={suggestion => suggestion.productName}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            renderSuggestionsContainer={renderSuggestionsContainer}
                            theme={{
                                container: 'autosuggest-container',
                                input: 'react-autosuggest__input',
                                suggestionsContainer: 'react-autosuggest__suggestions-container',
                                suggestion: 'react-autosuggest__suggestion',
                                suggestionHighlighted: 'react-autosuggest__suggestion--highlighted'
                            }}
                            onSuggestionSelected={onSuggestionSelected}
                        />
                        </span>
                        <div className="detail_name"></div>
                    </div>
                    <div className="detail_container">
                        <input type="date" name="purchase_date" className="detail" value={formData.purchase_date} onChange={handleChange} placeholder="Purchase Date" />
                        <div className="detail_name">Purchase Date</div>
                    </div>
                    <div className="detail_container">
                        <input type="text" name="warranty_period" className="detail" value={formData.warranty_period} onChange={handleChange} placeholder="e.g. 5 years" />
                        <div className="detail_name">Warranty Period</div>
                    </div>
                    <div className="detail_container">
                        <input type="file" name="receipt" className="detail" onChange={handleFileChange} />
                        <div className="detail_name">Receipt</div>
                    </div>
                    <button type="submit" id="addButton">Update</button>
                </div>
            </form>
        </>
    );
}

export default EditWarranty;
