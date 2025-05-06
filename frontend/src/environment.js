const isProd = process.env.NODE_ENV === 'production';
const server = isProd ? "" : "http://localhost:7000";
export default server;