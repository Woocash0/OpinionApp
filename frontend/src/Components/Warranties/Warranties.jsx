import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddButton from '../images/add_button.svg';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { toast } from 'react-hot-toast';
import Loading from '../Loading';

const Warranties = ({ onSelectWarranty }) => {
    const [warranties, setWarranties] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true); // Dodaj stan do śledzenia ładowania
    const signOut = useSignOut();
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentDate(new Date());

        // Pobranie autoryzacji z ciasteczek
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const authToken = cookies.find(cookie => cookie[0] === '_auth');

        // Ustawienie stanu ładowania na true przed rozpoczęciem pobierania danych
        setLoading(true);

        // Pobranie danych użytkownika
        axios.get('http://localhost:8000/account', {
            headers: {
                'Authorization': `Bearer ${authToken[1]}`
            }
        })
        .then(response => {
            const userEmail = response.data.user.email;
            // Pobranie gwarancji dla użytkownika
            axios.get('http://localhost:8000/warranties', {
                params: {
                    owner: userEmail
                }
            })
            .then(response => {
                setWarranties(Array.isArray(response.data.warranties) ? response.data.warranties : []);
                console.log(response.data.warranties);
            })
            .catch(error => {
                toast.error("Error getting warranties", error.response.data.message);
                setWarranties([]); // Ustawienie warranties na pustą tablicę w przypadku błędu
            })
            .finally(() => {
                setLoading(false); // Ustawienie stanu ładowania na false po zakończeniu pobierania danych
            });

        })
        .catch(error => {
            toast.error("Authorization Error", error.response.data.message);
            signOut();
            navigate('/loginform');
        })
        .finally(() => {
            setLoading(false); // Ustawienie stanu ładowania na false w przypadku błędu
        });
    }, []);

    if (loading) {
        return <Loading />; // Renderowanie komponentu Loading podczas ładowania danych
    }

    return (
        <>
            <Link to="/add_warranty" className="add_button">
                <img src={AddButton} alt="Add Warranty" />
            </Link>

            <header>Active warranties ({warranties.length})</header>
            <section className="warranties">
                {Array.isArray(warranties) && warranties.map(warranty => (
                    <div className="warranty_box" key={warranty.id} onClick={() => onSelectWarranty(warranty)}>
                        <img src={require(`../../Images/iconImages/${warranty.category}.svg`)}  alt={warranty.product_name} />
                        <div className="imgname">{`${warranty.category}`}</div>
                        <div className="hidden_details" style={{ display: 'none' }}>
                            <div id="productName">{warranty.product_name}</div>
                            <div id="purchaseDate">{warranty.purchase_date}</div>
                            <div id="warrantyPeriod">{warranty.warranty_period}</div>
                            <div id="receipt">{warranty.receipt}</div>
                            <div id="tags">
                                {/*warranty.tags.map(tag => (
                                    <div key={tag.id}>{tag.name}</div>
                                ))*/}
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
};

export default Warranties;
