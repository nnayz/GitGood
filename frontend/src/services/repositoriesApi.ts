import api from "@/services/api";

export const repositoriesApi = {
    getRepositories: async () => {
        const response = await api.get('/getAllRepositories');
        return response.data;
    }
}