export const API_ENDPOINTS = {
  POSTS: "https://jsonplaceholder.typicode.com/posts",
  USERS: "https://jsonplaceholder.typicode.com/users",
  VIA_CEP: (cep) => `https://viacep.com.br/ws/${cep}/json/`
};

export const userCepMap = {
  1: "01001000",
  2: "30140071",
  3: "20040002",
  4: "40010000",
  5: "70040900",
  6: "80010000",
  7: "90020000",
  8: "69005010",
  9: "66015000",
  10: "64000000"
};