import { axios } from './interceptAxios';

export async function sendEmail(email) {
  try {
    const response = await axios.post('/email', { email });

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}
