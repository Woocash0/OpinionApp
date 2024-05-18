import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddWarranty() {
    const [formData, setFormData] = useState({
        category: '',
        product_name: '',
        purchase_date: '',
        warranty_period: '',
        receipt: null,
        tags: []
    });

    const [categories, setCategories] = useState([]);
    const [fieldErrors, setFieldErrors] = useState([]);

    useEffect(() => {
        axios.get('/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, receipt: file });
    };

    const handleTagChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, tags: selectedTags });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'receipt') {
                formDataToSend.append(key, value);
            } else {
                formDataToSend.append(key, JSON.stringify(value));
            }
        });

        axios.post('/api/add_warranty', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            // Handle success, maybe redirect to warranties page
        })
        .catch(error => {
            if (error.response.data && error.response.data.violations) {
                setFieldErrors(error.response.data.violations.map(violation => violation.message));
            } else {
                console.error('Error:', error);
            }
        });
    };

    return (
        <div>
            <header>Add warranty</header>
            <form onSubmit={handleSubmit}>
                <div id="info">
                    <div className="detail_container">
                        <select name="category" className="detail" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                        <div className="detail_name">Category</div>
                    </div>
                    {/* Add other form fields similarly */}

                    <div className="detail_container">
                        <button type="submit" id="sign">ADD</button>
                    </div>
                </div>
            </form>
            <div className="messages">
                <ul>
                    {fieldErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AddWarranty;
