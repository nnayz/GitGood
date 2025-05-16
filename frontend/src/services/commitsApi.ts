import api from "@/services/api";

export const commitsApi = {
    getCommits: async (repositoryId: number) => {
        if(repositoryId === 0) {
            return [];
        }
        const response = await api.get(`/repositories/${repositoryId}/commits`);
        return response.data;
    }
}