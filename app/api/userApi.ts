import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getAllUsers = async () => {
  const { data } = await API.get('/auth/all-users', {
    params: { limit: 999 }
  });
//   console.log("Data Found:", data.data);
  return data.data; 
};