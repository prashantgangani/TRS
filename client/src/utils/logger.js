import { API_URL } from '../config';

export const logAdminAction = async (action, details) => {
    try {
        const adminName = localStorage.getItem('trs_name') || 'Unknown Admin';
        await fetch(`${API_URL}/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminName, action, details })
        });
    } catch (err) {
        console.error("Failed to log action:", err);
    }
};