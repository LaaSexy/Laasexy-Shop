import axios, { AxiosRequestConfig } from 'axios';

const headers = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Iis4NTU1MDkwMDAwMCIsInVzZXJJZCI6IjVkZTFmMmUyMmM5Zjg1MDAyNjcwOTI3ZCIsImlhdCI6MTY2NzM2MTU0OH0.EFTn81InJ9qlh9hHWLYUhZSWs39Yb2rszQO6sBHUgyU',
  timeout: 50000,
  'Content-Type': 'application/json',
};

// Define the type for the parameters in the post request
interface PostParams {
  [key: string]: any; // You can make this type more specific as needed
}

const get = (url: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url,
    headers, // Reusing the defined headers
  };
  return axios(config);
};

const post = (url: string, params: PostParams) => {
  const config: AxiosRequestConfig = {
    method: 'post',
    url,
    headers,
    data: params,
  };
  return axios(config);
};

const api = { get, post };
export default api;
