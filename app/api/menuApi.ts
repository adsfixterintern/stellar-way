import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// export const getMenus = async (category?: string) => {

//   const { data } = await API.get('/menu', {
//     params: { category: category === 'All' ? undefined : category }
//   });
//   console.log(data.data)
//   return data.data; 
// };
export const getMenus = async () => {
 
  const { data } = await API.get('/menu');
  return data.data; 
};