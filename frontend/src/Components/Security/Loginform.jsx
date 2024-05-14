import React, { useState, useEffect  } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import logo from "../images/logo.svg"
import queryString from 'query-string';
import axios from 'axios';
import { useSignIn } from "react-auth-kit";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const signIn = useSignIn();


  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const { success } = queryString.parse(location.search); // Pobiera parametr 'success'
  const [showSuccess, setShowSuccess] = useState(success === 'true');
  const successRegister = "Rejestracja przebiegła pomyślnie!"


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
      console.log(formData);
      const response = await axios.post('http://localhost:8000/login', formData);
signIn({
  token: response.data.token,
  expiresIn: 3600,
  tokenType: "Bearer",
  authState: { email: formData.email },
});
      console.log('Login successful:', response.data);

      if (response.status === 200) {
        const { token, user } = response.data; // Pobierz dane z odpowiedzi
        
        const userData = {
          name: user.name,
          surname: user.surname,
          email: user.email, // Dane użytkownika do zapisania
        }; // Upewnij się, że serwer zwraca token

        
        setShowSuccess(true);
        setSuccessMessage('Zalogowano pomyślnie!');

        setTimeout(() => {
          navigate('/'); 
        }, 1000);  
      }
    } catch (err) {
    console.error('Login error:', err); // Log pełnego błędu do debugowania

    // Sprawdź, czy `response` i `response.data` istnieją przed uzyskaniem dostępu
    if (err.response && err.response.data) {
      setError(`Błąd podczas logowania: ${err.response.data.message || 'Nieznany błąd'}`);
    } else {
      setError('Błąd podczas logowania. Sprawdź swoje dane.'); // Ogólny komunikat błędu
    }
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
              <p>{successRegister}</p>
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
          onChange={(e) => setPassword(e.target.value)}
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

