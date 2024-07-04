import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./addProduct.css";
import {toast} from "react-hot-toast";

const infoStyle = {
    backgroundColor: 'unset',
    width: 'inherit',
    justifyContent: 'space-evenly',
    fontFamily: 'Inter'
};

function AddProduct() {
    const [formData, setFormData] = useState({
        category_id: '',
        subcategory_id: '',
        subsubcategory_id: '',
        product_name: '',
        producer: '',
        barcode: '',
        description: '',
        image: null
    });

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subsubcategories, setSubsubcategories] = useState([]);
    const [fieldErrors, setFieldErrors] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value);
        setFormData({ ...formData, category_id: categoryId, subcategory_id: '', subsubcategory_id: '' });

        const selectedCategory = categories.find(category => category.id === categoryId);
        setSubcategories(selectedCategory ? selectedCategory.children || [] : []);
        setSubsubcategories([]);
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = parseInt(e.target.value);
        setFormData({ ...formData, subcategory_id: subcategoryId, subsubcategory_id: '' });

        const selectedSubcategory = subcategories.find(subcategory => subcategory.id === subcategoryId);
        setSubsubcategories(selectedSubcategory ? selectedSubcategory.children || [] : []);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                formDataToSend.append(key, value);
            }
        });

        if (!formData.image) {
            formDataToSend.append('image', 'no-image.svg');
        }

        // Debugging output
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const authToken = cookies.find(cookie => cookie[0] === '_auth');

        axios.post('http://localhost:8000/add_product', formDataToSend, {
            headers: {
              'Authorization': `Bearer ${authToken[1]}`
            }
          })
        .then(response => {
            console.log('Product added successfully:', response.data);
            toast.success('Product added successfully');
        })
        .catch(error => {
            if (error.response.data) {
                toast.error(error.response.data.error + ", Check if this product already exits");
            } else {
                toast.error('Error adding product');
            }
        });
    };

    return (
        <>
            <header>Add Product</header>
            <form onSubmit={handleSubmit}>
                <div id="info" style={infoStyle}>
                    <div className="detail_container">
                        <select name="category_id" className="detail" value={formData.category_id} onChange={handleCategoryChange}>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <div className="detail_name">Category</div>
                    </div>
                    {subcategories.length > 0 && (
                        <div className="detail_container">
                            <select name="subcategory_id" className="detail" value={formData.subcategory_id} onChange={handleSubcategoryChange}>
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
                            <select name="subsubcategory_id" className="detail" value={formData.subsubcategory_id} onChange={handleChange}>
                                <option value="">Select Sub-Subcategory</option>
                                {subsubcategories.map(subsubcategory => (
                                    <option key={subsubcategory.id} value={subsubcategory.id}>{subsubcategory.name}</option>
                                ))}
                            </select>
                            <div className="detail_name">Sub-Subcategory</div>
                        </div>
                    )}
                    <div className="detail_container">
                        <input type="text" name="product_name" className="detail" value={formData.product_name} onChange={handleChange} placeholder="Product Name" />
                        <div className="detail_name">Product Name</div>
                    </div>
                    <div className="detail_container">
                        <input type="text" name="producer" className="detail" value={formData.producer} onChange={handleChange} placeholder="Producer" />
                        <div className="detail_name">Producer</div>
                    </div>
                    <div className="detail_container">
                        <textarea name="description" className="detailTextArea" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
                        <div className="detail_name">Description</div>
                    </div>
                    <div className="detail_container">
                        <input type="file" name="image" className="detail" onChange={handleFileChange} />
                        <div className="detail_name">Image</div>
                    </div>
                    <div className="detail_container">
                        <input type="text" name="barcode" className="detail" value={formData.barcode} onChange={handleChange} placeholder="EAN/GTIN" />
                        <div className="detail_name">EAN/GTIN</div>
                    </div>
                    <button type="submit" id="addButton">ADD</button>
                </div>
            </form>
        </>
    );
}

export default AddProduct;
