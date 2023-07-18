import { axios } from "./interceptAxios";

export async function handleLoginFormSubmit(e) {
  if (!localStorage.getItem("token")) {
    e.preventDefault();
    const { emailOrName, password } = this;
    const user = {
      email: emailOrName.value,
      password: password.value,
    };

    try {
      const { data } = await axios.post('/users/login', user);

      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  }
}

export async function handleRegisterFormSubmit(e) {
  e.preventDefault();
  const { name, password, email } = this;
  const newUser = {
    username: name.value,
    password: password.value,
    email: email.value,
  };

  try {
    const { data } = await axios.post('/users/register', newUser);

    console.log(data.message)
  } catch (err) {
    console.log(err);
  }
}
