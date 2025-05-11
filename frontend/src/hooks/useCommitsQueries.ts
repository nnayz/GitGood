import { useQuery } from "@tanstack/react-query";
import { commitsApi } from "@/services/commitsApi";

export const useCommitsQueries = (repositoryId: number) => {
    return useQuery({
        queryKey: ["commits", repositoryId],
        queryFn: () => commitsApi.getCommits(repositoryId),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: 1000 * 60 * 5,
    });
}