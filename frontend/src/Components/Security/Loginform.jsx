import React, { useState, useEffect  } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import logo from "../images/logo.svg"
import queryString from 'query-string';
import axios from 'axios';
import { useSignIn } from "react-auth-kit";
import {toast} from "react-hot-toast";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(null);
  const signIn = useSignIn();


  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const { success } = queryString.parse(location.search); // Pobiera parametr 'success'
  const [showSuccess, setShowSuccess] = useState(success === 'true');

  


  useEffect(() => {
    if (success === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [success, location.pathname]);

  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:8000/login', formData);
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: formData.email, token: response.data.token},
      });

      if (response.status === 200) {
        const { token, user } = response.data; // Pobierz dane z odpowiedzi
        
        const userData = {
          name: user.name,
          surname: user.surname,
          email: user.email, // Dane użytkownika do zapisania
        }; // Upewnij się, że serwer zwraca token

        
        setShowSuccess(true);
        setSuccessMessage('Login successful!');
        toast.success(response.data.message, {
          className: 'react-hot-toast',
        });

        setTimeout(() => {
          navigate('/'); 
        }, 1000);  
      }
    } catch (err) {
        console.error('Login Error:', err);

        if (err.response && err.response.data) {
          setError(`Login Error: ${err.response.data.error || 'Unknown Error'}`);
          toast.error(err.response.data.error, {
            className: 'react-hot-toast',
          });
        }
      }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValid = hasUpperCase && hasNumber;

    if (!isValid) {
      setError('Password must contain at least one uppercase letter and one number.');
    } else {
      setError('');
    }

    return isValid;
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setPassword(value);

    // Clear any existing timer
    if (timer) {
      clearTimeout(timer);
    }

    // Validate the password
    const isValid = validatePassword(value);

    // Set a new timer to show the error after a delay
    if (!isValid) {
      const newTimer = setTimeout(() => {
        toast.error(error, {
          className: 'react-hot-toast', // Apply the class for custom styling
        });
      }, 1000); // Delay in milliseconds (500ms = 0.5s)
      setTimer(newTimer);
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit} className="login">
        <div className="header_login">
          <div>Sign in</div>
          <div className="messages">
          {showSuccess  && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>)}
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          autoComplete="email"
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={handleChange}
          className="form-control"
          autoComplete="current-password"
          required
        />
        <button className="btn btn-lg btn-primary" type="submit" id="sign">
          SIGN IN
        </button>
        <Link to="../signinform" className="btn" id="signup">
            SIGN UP
        </Link>
      </form>
    </div>
  );
}

export { LoginForm };

