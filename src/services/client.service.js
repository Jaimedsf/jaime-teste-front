import AuthService from "./auth.service";
import axios from "axios";

const API_URL = "http://localhost:8080/api"; 

const getAuthToken = () => {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser && currentUser.accessToken) {
    return currentUser.accessToken;
  }
  return null;
};

// Crie uma instância do Axios com configurações padrão, incluindo o cabeçalho de autorização
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getAuthToken()}` // Adicione o token JWT ao cabeçalho de autorização
  },
});

// Intercepte todas as solicitações para adicionar o cabeçalho de autorização
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
     // console.log("Cabeçalho de Autorização definido:", config.headers["Authorization"]); // Imprime o cabeçalho no console
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getAllClients = () => {
  return axiosInstance.get("/clients");
};

const createClient = (data) => {
  return axiosInstance.post("/clients/add", data);
};

const removeClient = (id) => {
  return axiosInstance.delete(`/clients/${id}`);
};

const ClientService = {
  getAllClients,
  createClient,
  removeClient,
};

export default ClientService;
