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
