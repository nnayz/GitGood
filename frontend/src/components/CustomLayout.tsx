import React from 'react';
import RepositoriesSidebar from '@/components/RepositoriesSidebar';
import CommitsSidebar from '@/components/CommitsSidebar';
import { Commit } from '@/models/commit';

interface CustomLayoutProps {
  children?: React.ReactNode;
  selectedRepositoryId: number;
  commits: Commit[];
  isLoadingCommits: boolean;
  expandedCommitSha: string | null;
  setExpandedCommitSha: (sha: string | null) => void;
  onRepositorySelect: (repositoryId: number) => void;
}

export function CustomLayout({ children, selectedRepositoryId, commits, isLoadingCommits, expandedCommitSha, setExpandedCommitSha, onRepositorySelect }: CustomLayoutProps) {

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <RepositoriesSidebar 
        onRepositorySelect={onRepositorySelect} 
        selectedRepositoryId={selectedRepositoryId ?? 0} 
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto w-[calc(100%-288px)]">
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