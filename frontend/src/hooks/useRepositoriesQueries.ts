import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { repositoriesApi } from "@/services/repositoriesApi";

export const useRepositoriesQueries = () => {
    return useQuery({
        queryKey: ['repositories'],
        queryFn: repositoriesApi.getRepositories,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: 1000 * 60 * 5,
    });
}

export const useAddRepository = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (repositoryUrl: string) => repositoriesApi.addRepository(repositoryUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repositories'] });  
        },
        onError: (error) => {
            console.error(error);
        },
    });
}

export const useDeleteRepository = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (repositoryId: number) => repositoriesApi.deleteRepository(repositoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repositories'] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
}