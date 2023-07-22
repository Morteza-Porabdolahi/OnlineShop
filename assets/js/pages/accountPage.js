import {$$} from '../utils/utils';
import {loginUser, registerUser} from '../api/api';
import {toast} from '../utils/toast';

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

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  toast.loading();

  const user = {
    email: loginForm.emailOrName.value,
    password: loginForm.password.value,
  };

  const data = await loginUser(user);

  if (data.error) {
    toast.error(data.error);
  } else {
    toast.success(data.message);

    const token = data.token;
    localStorage.setItem('access_token', token);

    setTimeout(() => {
      location.href = '/';
    }, 2000);
  }
});
