import { getTokenFromCookies } from './auth';

import CryptoJS from 'crypto-js';

const secretKey = 'secret';

export const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
};

export const decryptData = (encryptedData) => {
    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedData || decryptedData.trim() === '') {
            throw new Error('Invalid JSON data');
        }

        const parsedData = JSON.parse(decryptedData);
        return parsedData;
    } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
    }
};




export const getUserDataFromCookies = async () => {
    const token = getTokenFromCookies();
    
    if (token) {
        try {
            const response = await fetch(
            `${process.env.REACT_APP_SERVER_HOST}/api/v1/account/info`,
            {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
                }
            });
            const data = await response.json();
            if (response.status === 401) {
                console.error("Failed get profile");
                return null;
            }
    
            if (response.ok) {
                console.log("API call successful");
                console.log(data)
                return data
            } else {
                console.error("API call failed");
                return null
            }
        }   
        catch (error) {
            console.error("Error calling API:", error);
            return null
        }
    }
}