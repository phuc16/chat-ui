export const uploadFileToS3 = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        const responseData = await response.json();
        const fileUrl = responseData.fileUrl;

        console.log('File uploaded successfully. File URL:', fileUrl);
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
