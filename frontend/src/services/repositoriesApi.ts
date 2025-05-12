import api from "@/services/api";

export const repositoriesApi = {
    getRepositories: async () => {
        const response = await api.get('/getAllRepositories');
        return response.data;
    },

    addRepository: async (repositoryUrl: string) => {
        const response = await api.post('/import-repo', { url: repositoryUrl });
        return response.data;
    },

    deleteRepository: async (repositoryId: number) => {
        const response = await api.delete(`/repositories/${repositoryId}`);
        return response.data;
    }
}