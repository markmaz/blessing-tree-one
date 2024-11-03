const config = {
    apiBaseUrl: process.env.NODE_ENV === 'production'
        ? 'http://www.blessing-tree.com:8080/api/v1'
        : 'http://localhost:8080/api/v1',
};

export default config;
