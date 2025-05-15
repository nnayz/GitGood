import api from "./api";

export const chatApi = {
    sendMessage: async (repositoryId: number, message: string) => {
        const response = await api.post(`/repositories/${repositoryId}/chat`, { message: message, repository_id: repositoryId });
        return response.data;
    }
}