export const TOKEN_KEY = "auth_token";
export const USER_KEY = "current_user";

export const getUserToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getUserToken();
};

export const getUser = () => {
  const userString = localStorage.getItem(USER_KEY);
  return userString ? JSON.parse(userString) : null;
};
