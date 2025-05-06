const isProd = process.env.NODE_ENV === 'production';
const server = isProd ? "https://converze-backend.onrender.com" : "http://localhost:7000";
export default server;