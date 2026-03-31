export const getSingleMenu = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
    cache: 'no-store'
  });
  const result = await res.json();
  return result.data;
};