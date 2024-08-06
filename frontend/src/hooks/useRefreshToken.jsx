import { useSignIn, useSignOut, useAuthUser } from 'react-auth-kit';
import axios from 'axios';
import toast from 'react-hot-toast';

const useRefreshToken = () => {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const auth = useAuthUser();

  const refreshToken = () => {
    const user = auth();
    const oldRefreshToken = user?.refreshToken;

    if (!oldRefreshToken) {
      signOut();
      return Promise.resolve(null); // Zwrotywanie rozwiązanej obietnicy z null
    }

    console.log("Odświeżam token");
    return axios.post('http://localhost:8000/refresh', { refreshToken: oldRefreshToken })
      .then(response => {
        if (response.status === 200) {
          const { token, newRefreshToken } = response.data;
          signIn({
            token,
            expiresIn: 3600,
            tokenType: 'Bearer',
            authState: { email:response.data.user.email, token, refreshToken: newRefreshToken, roles: response.data.user.roles },
          });
          toast.success("Session successfully restored", {
            className: 'react-hot-toast',
          });
          return token;
        } else {
          console.log('Failed to refresh token:', response.statusText);
          signOut();
          return null;
        }
      })
      .catch(error => {
        console.log('Failed to refresh token:', error);
        signOut();
        return null;
      });
  };

  return refreshToken;
};

export default useRefreshToken;
