import axios from 'axios';

export const getImageSource = async () => {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/photos/1'
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return response.data;
};
