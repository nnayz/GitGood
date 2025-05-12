import React, { useState } from 'react';
import { useCommitsQueries } from '@/hooks/useCommitsQueries';
import RepositoriesSidebar from '@/components/RepositoriesSidebar';
import CommitsSidebar from '@/components/CommitsSidebar';

interface CustomLayoutProps {
  children?: React.ReactNode;
}

export function CustomLayout({ children }: CustomLayoutProps) {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);
  const { data: commits, isLoading: isLoadingCommits } = useCommitsQueries(selectedRepositoryId ?? 0);
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>(null);

  const handleSelectRepository = (repositoryId: number) => {
    setSelectedRepositoryId(repositoryId);
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <RepositoriesSidebar 
        onRepositorySelect={handleSelectRepository} 
        selectedRepositoryId={selectedRepositoryId ?? 0} 
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      {/* Right sidebar */}
      <CommitsSidebar 
        commits={commits} 
        isLoadingCommits={isLoadingCommits} 
        expandedCommitSha={expandedCommitSha} 
        setExpandedCommitSha={setExpandedCommitSha} 
      />
    </div>
  );
} 