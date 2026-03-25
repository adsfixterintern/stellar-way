import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getEvents = async () => {
  const { data } = await API.get('/events/event', {
    params: { limit: 999 }
  });
//   console.log("Data Found:", data.data);
  return data.data; 
};