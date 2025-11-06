// backend/src/config.ts

const config = {
    database: {
        host: 'localhost',
        port: 5432,
        user: 'your_username',
        password: 'your_password',
        database: 'traffic_violation_db',
    },
    api: {
        key: 'your_api_key',
        endpoint: 'http://localhost:8000',
    },
};

export default config;