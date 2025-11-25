import { jwtDecode } from 'jwt-decode';

class AuthService {
  setToken(token) {
    localStorage.setItem('id_token', token);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }

  isLoggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error in token verification: ', err);
      return true;
    }
  }

  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }
}

export default new AuthService();
