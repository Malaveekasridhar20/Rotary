import axios from 'axios';

const API_URL = 'http://localhost:3031/api/awards';

export const getAwards = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    console.log('Using mock awards data');
    return { data: [] };
  }
};

export const createAward = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    console.log('Mock create award');
    return { data };
  }
};

export const deleteAward = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    console.log('Mock delete award');
    return { data: { id } };
  }
};