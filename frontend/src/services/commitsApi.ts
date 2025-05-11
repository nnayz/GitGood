import api from "@/services/api";

export const commitsApi = {
    getCommits: async (repositoryId: number) => {
        const response = await api.get(`/repositories/${repositoryId}/commits`);
        return response.data;
    }
}