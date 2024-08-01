import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddButton from '../images/add_button.svg';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { toast } from 'react-hot-toast';
import Loading from '../Loading';
import { motion } from "framer-motion";

const Warranties = ({ onSelectWarranty }) => {
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true); // Dodaj stan do śledzenia ładowania
    const signOut = useSignOut();
    const navigate = useNavigate();
    const currentDate = new Date();

    useEffect(() => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const authToken = cookies.find(cookie => cookie[0] === '_auth');
    
        setLoading(true);
    
        axios.get('http://localhost:8000/account', {
            headers: {
                'Authorization': `Bearer ${authToken[1]}`
            }
        })
        .then(response => {
            const userEmail = response.data.user.email;
            axios.get('http://localhost:8000/warranties', {
                params: {
                    owner: userEmail
                }
            })
            .then(response => {
                setWarranties(Array.isArray(response.data.warranties) ? response.data.warranties : []);
            })
            .catch(error => {
                toast.error("Error getting warranties", error.response.data.message, {
                    className: 'react-hot-toast',
                  });
                setWarranties([]);
            })
            .finally(() => {
                setLoading(false);
            });
    
        })
        .catch(error => {
            toast.error("Authorization Error", error.response.data.message, {
                className: 'react-hot-toast',
              });
            signOut();
            navigate('/loginform');
        });
    }, []);

    const calculateExpirationDate = (purchaseDate, warrantyPeriod) => {
        const purchase = new Date(purchaseDate);
        purchase.setFullYear(purchase.getFullYear() + warrantyPeriod);
        return purchase;
    };

    const activeWarranties = warranties.filter(warranty => {
        const expirationDate = calculateExpirationDate(warranty.purchaseDate, warranty.warrantyPeriod);
        return expirationDate > currentDate;
    });

    const inactiveWarranties = warranties.filter(warranty => {
        const expirationDate = calculateExpirationDate(warranty.purchaseDate, warranty.warrantyPeriod);
        return expirationDate <= currentDate;
    });

    if (loading) {
        return <Loading />; 
    }

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.3 }}
    >
            <Link to="/add_warranty" className="add_button">
                <img src={AddButton} alt="Add Warranty" />
            </Link>

            <header>Active warranties ({activeWarranties.length})</header>
            <section className="warranties">
                {Array.isArray(activeWarranties) && activeWarranties.map(warranty => (
                    <div className="warranty_box" key={warranty.id} onClick={() => onSelectWarranty(warranty)}>
                        <img src={require(`../../Images/iconImages/${warranty.category}.svg`)} alt={warranty.product_name} />
                        <div className="imgname">{warranty.category}</div>
                    </div>
                ))}
            </section>

            <header>Expired warranties ({inactiveWarranties.length})</header>
            <section className="warranties">
                {Array.isArray(inactiveWarranties) && inactiveWarranties.map(warranty => (
                    <div className="warranty_box" key={warranty.id} onClick={() => onSelectWarranty(warranty)}>
                        <img src={require(`../../Images/iconImages/${warranty.category}.svg`)} alt={warranty.product_name} />
                        <div className="imgname">{warranty.category}</div>
                    </div>
                ))}
            </section>
        </motion.div>
    );
};

export default Warranties;
