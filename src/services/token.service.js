const GetAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.accessToken;
};

const GetUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const SetUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const RemoveUser = () => {
  localStorage.removeItem("user");
};

const TokenService = {
  GetAccessToken,
  GetUser,
  SetUser,
  RemoveUser,
};

export default TokenService;
