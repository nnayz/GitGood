import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables:');
console.log(process.env.VITE_GITHUB_CLIENT_ID);
console.log(process.env.VITE_GITHUB_CLIENT_SECRET);
console.log(process.env.VITE_API_URL);
