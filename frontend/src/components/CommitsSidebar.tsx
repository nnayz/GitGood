import React from 'react';
import { TypographyH3 } from '@/components/ui/Typography';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Commit } from '@/models/commit';
import { CalendarIcon, FileTextIcon } from '@radix-ui/react-icons';

interface CommitsSidebarProps {
    commits?: Commit[];
    isLoadingCommits: boolean;
    expandedCommitSha: string | null;
    setExpandedCommitSha: (sha: string | null) => void;
}

const CommitsSidebar: React.FC<CommitsSidebarProps> = ({ commits, isLoadingCommits, expandedCommitSha, setExpandedCommitSha }) => {
    return (
      <div className="w-80 border-l border-border flex flex-col h-full bg-background">
        <div className="p-2 border-b border-border text-left">
          <TypographyH3 title="Commits" />
        </div>
        <Separator className='my-2' />
        
        <div className="flex-1 overflow-y-auto p-2">
          {isLoadingCommits ? (
            <div>Loading...</div>
          ) : (
            <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
              {commits ? (
                commits.map((commit: Commit) => {
                  const isExpanded = expandedCommitSha === commit.sha;
                  return (
                    <Card
                      key={commit.sha}
                      className={`mb-2 border border-border shadow-sm bg-card text-card-foreground rounded-lg hover:shadow-md transition-shadow cursor-pointer p-0 ${isExpanded ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setExpandedCommitSha(isExpanded ? null : commit.sha)}
                    >
                      <CardContent className="p-2">
                        <div
                          className={`font-semibold text-foreground text-sm mb-1 text-left ${isExpanded ? '' : 'truncate'}`}
                          title={commit.message}
                        >
                          {commit.message}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-1">
                          <span className="flex items-center gap-1">
                            👤
                            <span className="font-medium text-foreground">{commit.author}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(commit.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            🌿
                            <span className="font-mono text-primary font-semibold">{commit.branch_name}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            #
                            <span className="font-mono text-muted-foreground" title={commit.sha}>{commit.sha.slice(0, 7)}</span>
                          </span>
                        </div>
                        <div className="border-t border-border my-1" />
                        <div className="flex flex-wrap gap-1 mt-1">
                          {commit.files_changed && commit.files_changed.length > 0 ? (
                            commit.files_changed.slice(0, 5).map((file, idx) => (
                              <span
                                key={file + idx}
                                className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full text-[11px] font-mono truncate max-w-[90px]"
                                title={file}
                              >
                                <FileTextIcon className="inline w-3 h-3 mr-0.5 align-text-bottom" />
                                {file}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No files</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-muted-foreground">Select a repository to see commits</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
}

export default CommitsSidebar;