export const $$ = document;

export function getUserToken() {
  return localStorage.getItem('access_token');
}

export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
      window
          .atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
  );

  return JSON.parse(jsonPayload);
}

export function formatPrice(price) {
  return `${new Intl.NumberFormat('fa-IR').format(price)} تومان`;
}

export function handleUserToken() {
  const userToken = getUserToken();

  if (!userToken) return;

  const {exp, user} = parseJwt(userToken);
  const nowDate = Date.now();

  if (nowDate >= exp * 1000) {
    localStorage.removeItem('access_token');
    location.href = '/';
  } else {
    return user;
  }
}

export function calculateProductRealPrice(price, discount) {
  return ((100 - discount) / 100) * price;
}

export {toast} from './toast';