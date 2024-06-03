import { jwtDecode  } from 'jwt-decode';

export const verifyToken = (token) => {
    try {
        let decodedToken = jwtDecode(token);
        let currentDate = new Date();
    
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            console.log("Token expired.");
            return null;
        } 
        return decodedToken;
    } catch (error) {
        console.log(error);
        return null
    }
};

export const getTokenFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    return null;
};
