import { GoogleLogin } from 'react-google-login';
import PropTypes from 'prop-types';
import axios from 'axios';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleGoogleSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const serverResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/socialAuth/google-login`, {
        tokenId,
      });

      const { token, user } = serverResponse.data;
      onLoginSuccess({ token, user });
    } catch (error) {
      console.error('Google 로그인 실패:', error);
      alert('Google 로그인에 실패했습니다.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google 로그인 실패:', error);
    alert('Google 로그인에 실패했습니다.');
  };

  return (
    <GoogleLogin
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      buttonText="Google로 로그인"
      onSuccess={handleGoogleSuccess}
      onFailure={handleGoogleFailure}
      cookiePolicy="single_host_origin"
    />
  );
};

GoogleLoginButton.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default GoogleLoginButton;
