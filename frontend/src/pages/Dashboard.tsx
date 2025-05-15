import { CustomLayout } from '@/components/CustomLayout';
import NavigationBar from '@/components/NavigationBar';
import ChatInterface from '@/components/ChatInterface';
import { useState } from 'react';
import { useCommitsQueries } from '@/hooks/useCommitsQueries';

const Dashboard: React.FC = () => {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);
  const { data: commits, isLoading: isLoadingCommits } = useCommitsQueries(selectedRepositoryId ?? 0);
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>(null);

  const handleSelectRepository = (repositoryId: number) => {
    setSelectedRepositoryId(repositoryId);
  }


  return (
    <CustomLayout
      selectedRepositoryId={selectedRepositoryId ?? 0}
      commits={commits ?? []}
      isLoadingCommits={isLoadingCommits}
      expandedCommitSha={expandedCommitSha}
      setExpandedCommitSha={setExpandedCommitSha}
      onRepositorySelect={handleSelectRepository}
    >
      <div className="flex flex-col h-full overflow-auto">
        <NavigationBar />
        <div className="flex-1 p-4 flex justify-center">
          <div className="w-2xl">
            <ChatInterface repositoryId={selectedRepositoryId ?? 0} />
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default Dashboard;