import axios from 'axios';

const headers = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Iis4NTU1MDkwMDAwMCIsInVzZXJJZCI6IjVkZTFmMmUyMmM5Zjg1MDAyNjcwOTI3ZCIsImlhdCI6MTY2NzM2MTU0OH0.EFTn81InJ9qlh9hHWLYUhZSWs39Yb2rszQO6sBHUgyU',
};

const get = (url: string) => {
  return axios({
    method: 'get',
    url,
    headers,
  });
};

const api = { get };
export default api;
