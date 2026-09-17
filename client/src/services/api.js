// client/src/services/api.js
// Pengurus Panggilan API Berpusat MY-PMO PKPMP

export const API_BASE_URL = 'http://localhost/My-PMO/api/modules';

export const API_ENDPOINTS = {
    AUTH: `${API_BASE_URL}/auth.php`,
    DASHBOARD: `${API_BASE_URL}/dashboard.php`,
    PROJECTS: `${API_BASE_URL}/projects.php`,
    TASKS: `${API_BASE_URL}/tasks.php`,
    FINANCES: `${API_BASE_URL}/finances.php`,
    DOCUMENTS: `${API_BASE_URL}/documents.php`,
    GANTT: `${API_BASE_URL}/gantt.php`,
    MEMBERS: `${API_BASE_URL}/project_members.php`,
    NOTIFICATIONS: `${API_BASE_URL}/notifications.php`,
    CALENDAR: `${API_BASE_URL}/calendar.php`,
    DIVISIONS: `${API_BASE_URL}/divisions.php`,
    UNITS: `${API_BASE_URL}/units.php`,
    USERS: `${API_BASE_URL}/users.php`,
    AUDIT: `${API_BASE_URL}/audit.php`,
    BACKUP: `${API_BASE_URL}/backup.php`,
    SMTP: `${API_BASE_URL}/smtp_settings.php`
};

export async function apiFetch(url, options = {}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const res = await fetch(url, { ...options, headers });
        return await res.json();
    } catch (err) {
        console.error(`Ralat API Fetch (${url}):`, err);
        throw err;
    }
}
