import { axios } from './interceptAxios';

export async function loginUser(user = {}) {
  try {
    const response = await axios.post('/users/login', user, {
      headers: {},
    });

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}

export async function registerUser(newUser = {}) {
  try {
    const response = await axios.post('/users/register', newUser, {
      headers: {},
    });

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
}
