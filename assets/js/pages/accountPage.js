import {$$, toast} from '../utils/utils';
import {loginUser, registerUser} from '../api/api';
import { handleUserLogin } from './general';

const registerForm = $$.getElementById('register-form');
const loginForm = $$.getElementById('login-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  toast.loading();

  const newUser = {
    username: registerForm.name.value,
    password: registerForm.password.value,
    email: registerForm.email.value,
  };

  const data = await registerUser(newUser);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);
  }
});

loginForm.addEventListener('submit', handleUserLogin);
