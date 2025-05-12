import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useCommitsQueries } from '@/hooks/useCommitsQueries';
import RepositoriesSidebar from '@/components/RepositoriesSidebar';
import CommitsSidebar from '@/components/CommitsSidebar';
// import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';



const Dashboard: React.FC = () => {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);
  const { data: commits, isLoading: isLoadingCommits } = useCommitsQueries(selectedRepositoryId ?? 0);
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>(null);
  

  const handleSelectRepository = (repositoryId: number) => {
    setSelectedRepositoryId(repositoryId);
  }

  return (
    <SidebarProvider>
      <RepositoriesSidebar onRepositorySelect={handleSelectRepository} selectedRepositoryId={selectedRepositoryId ?? 0} />
          <main>
            <SidebarTrigger className="absolute top-2 left-2 text-white" />
          </main>
          <CommitsSidebar commits={commits} isLoadingCommits={isLoadingCommits} expandedCommitSha={expandedCommitSha} setExpandedCommitSha={setExpandedCommitSha} />
    </SidebarProvider>
  );
};

export default Dashboard;