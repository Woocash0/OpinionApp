import { useEffect } from 'react';
import axios from 'axios';
import { useSignIn, useSignOut, useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const auth = useAuthUser();
  const user = auth(); // Pobierz obiekt authState
  const refreshToken = user?.refreshToken;
  console.log(refreshToken);

  useEffect(() => {
    const refreshTokenFn = async () => {
      if (!refreshToken) {
        signOut();
        navigate('/loginform');
      }

      try {
        const response = await axios.post('http://localhost:8000/refresh', { refreshToken });

        if (response.status === 200) {
          const { token, newRefreshToken } = response.data;

          // Update token and refreshToken in the auth state
          signIn({
            token,
            expiresIn: 3600,
            tokenType: 'Bearer',
            authState: { token: token, refreshToken: newRefreshToken }, // Updated token and refreshToken
          });
        } else {
          console.error('Failed to refresh token:', response.statusText);
          signOut();
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        signOut();
      }
    };

      refreshTokenFn();
  }, []);

  return null;
};

export default useRefreshToken;
