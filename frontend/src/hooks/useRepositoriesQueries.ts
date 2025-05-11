import { useQuery } from "@tanstack/react-query";
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