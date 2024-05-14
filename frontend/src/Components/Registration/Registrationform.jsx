import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import logo from "../images/logo.svg"
import axios from 'axios';

function RegistrationForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Name:', name);
    console.log('Surname:', surname);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirmed Password:', confirmedPassword);

    const formData = {
      name: name,
      surname: surname,
      email: email,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:8000/register', formData);
  
      console.log(response.data); 

    if (response.data.success) {
      navigate('/loginform?success=true', {
        state: { successMessage: 'Rejestracja przebiegła pomyślnie!' },
      });
    } else {
      setFieldErrors(response.data.errors || []);
    }
  } catch (error) {
    setFieldErrors(['Wystąpił błąd podczas rejestracji.']);
  }


  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit} className="login">
        <div className="header_login">
          <div>Sign up</div>
          {fieldErrors.length > 0 && (
            <div className="messages">
              <ul>
                {fieldErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
      )}
        </div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn" id="sign">
          SIGN UP
        </button>
        <Link to="../loginform" className="btn" id="signup">
            SIGN IN
        </Link>
      </form>
    </div>
  );
}

export default RegistrationForm;
