const API_URL = 'http://localhost:8000';

export const uploadViolationImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/detect_violation`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return response.json();
};

export const getViolationReports = async () => {
    const response = await fetch(`${API_URL}/violations`);

    if (!response.ok) {
        throw new Error('Failed to fetch violation reports');
    }

    return response.json();
};