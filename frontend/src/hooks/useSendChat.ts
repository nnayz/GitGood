
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/services/chatApi";

export const useSendChat = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ repositoryId, message }: { repositoryId: number, message: string }) => 
            chatApi.sendMessage(repositoryId, message),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chat", variables.repositoryId] });
        }
    });
}