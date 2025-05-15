import { useQuery } from "@tanstack/react-query";
import { commitsApi } from "@/services/commitsApi";

export const useCommitsQueries = (repositoryId: number) => {
    return useQuery({
        queryKey: ["commits", repositoryId],
        queryFn: () => commitsApi.getCommits(repositoryId),
    });
}