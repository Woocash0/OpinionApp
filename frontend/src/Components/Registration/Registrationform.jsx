import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import logo from "../images/logo.svg"
import axios from 'axios';
import {toast} from "react-hot-toast";

function RegistrationForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [arePasswordsSame, setArePasswordsSame] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmedPasswordTouched, setConfirmedPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
  
  useEffect(() => {
    if (emailTouched) {
      const timer = setTimeout(() => {
        setIsEmailValid(validateEmail(email));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (passwordTouched) {
      const timer = setTimeout(() => {
        setIsPasswordValid(validatePassword(password));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [password, passwordTouched]);

  useEffect(() => {
    if (passwordTouched && confirmedPasswordTouched) {
      const timer = setTimeout(() => {
        setArePasswordsSame(password === confirmedPassword);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [password, confirmedPassword, passwordTouched, confirmedPasswordTouched]);


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
        toast.success("Registrated successfully!", {
          className: 'react-hot-toast',
        });
        navigate('/loginform?success=true', {
          state: { successMessage: 'Registrated successfully!' },
        });
      } else {
        setFieldErrors(response.data.errors || []);
        toast.error(response.data.errors, {
          className: 'react-hot-toast',
        });
      }
    } catch (error) {
      setFieldErrors(error.response.data.errors || []);
      toast.error(error.response.data.errors, {
        className: 'react-hot-toast',
      });
    }


  };

  const handleLogoClick = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
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
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailTouched(true);
          }}
          className={`form-control ${emailTouched && !isEmailValid ? 'no-valid' : ''}`}
          required
        />
        {emailTouched && !isEmailValid && (
          <div className="email-error">
            Please enter a valid email address.
          </div>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordTouched(true);
          }}
          className={`form-control ${passwordTouched && !isPasswordValid ? 'no-valid' : ''}`}
          required
        />
        {passwordTouched && !isPasswordValid && (
          <div className="password-error">
            Password must be at least 8 characters long, contain an uppercase letter and a number.
          </div>
        )}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmedPassword}
          onChange={(e) => {
            setConfirmedPassword(e.target.value);
            setConfirmedPasswordTouched(true);
          }}
          className={`form-control ${confirmedPasswordTouched && !arePasswordsSame ? 'no-valid' : ''}`}
          required
        />
         
        {confirmedPasswordTouched && !arePasswordsSame && (
          <div className="password-error">
            Passwords do not match.
          </div>
        )}
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
