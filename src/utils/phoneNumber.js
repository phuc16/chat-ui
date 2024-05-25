export const convertPhoneNumber = (phoneNumber) => {
    if (typeof phoneNumber === 'string' && phoneNumber.startsWith('0')) {
        return '+84' + phoneNumber.slice(1);
    } else {
        return phoneNumber;
    }
}