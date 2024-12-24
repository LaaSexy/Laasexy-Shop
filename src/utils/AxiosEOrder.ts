import axios from 'axios';

const instanceEOrder = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_EORDER_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

export default instanceEOrder;
