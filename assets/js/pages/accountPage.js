import { $$ } from "../utils/utils";
import { handleLoginFormSubmit, handleRegisterFormSubmit } from "../api/user";

const registerForm = $$.getElementById("register-form");
const loginForm = $$.getElementById("login-form");

registerForm.addEventListener("submit" , handleRegisterFormSubmit);
loginForm.addEventListener("submit" , handleLoginFormSubmit);
