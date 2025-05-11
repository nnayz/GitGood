import { useEffect, useState } from 'react';
import { getUserData } from '../services/auth/github';
import { SidebarGroup, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Sidebar, SidebarMenu } from '@/components/ui/sidebar';
import { TypographyH3 } from '@/components/ui/Typography';
import { FileTextIcon, CalendarIcon } from '@radix-ui/react-icons';
import { useCommitsQueries } from '@/hooks/useCommitsQueries';
import { Commit } from '@/models/commit';
import { Card, CardContent } from '@/components/ui/card';
import RepositoriesSidebar from '@/components/RepositoriesSidebar';
interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

const Dashboard= () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(null);
  const { data: commits, isLoading: isLoadingCommits } = useCommitsQueries(selectedRepositoryId ?? 0);
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>(null);

  const handleSelectRepository = (repositoryId: number) => {
    setSelectedRepositoryId(repositoryId);
  }

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <RepositoriesSidebar onRepositorySelect={handleSelectRepository} />
      <main>
        <SidebarTrigger className="absolute top-2 left-2 text-white" />
      </main>
      <Sidebar side='right' className='w-72 bg-gray-50 border-l'>
        <SidebarGroup>
          <SidebarGroupLabel>
            <TypographyH3 title="Commits" />
          </SidebarGroupLabel>
          {isLoadingCommits ? (
              <div>Loading...</div>
            ) : (
              <SidebarMenu className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
                {commits ? (
                  commits.map((commit: Commit) => {
                    const isExpanded = expandedCommitSha === commit.sha;
                    return (
                      <Card
                        key={commit.sha}
                        className={`mb-2 border border-gray-200 shadow-sm bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer p-0 ${isExpanded ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={() => setExpandedCommitSha(isExpanded ? null : commit.sha)}
                      >
                        <CardContent className="p-2">
                          <div
                            className={`font-semibold text-gray-900 text-sm mb-1 ${isExpanded ? '' : 'truncate'}`}
                            title={commit.message}
                          >
                            {commit.message}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 mb-1">
                            <span className="flex items-center gap-1">
                              👤
                              <span className="font-medium text-gray-800">{commit.author}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(commit.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              🌿
                              <span className="font-mono text-green-700 font-semibold">{commit.branch_name}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              #
                              <span className="font-mono text-gray-500" title={commit.sha}>{commit.sha.slice(0, 7)}</span>
                            </span>
                          </div>
                          <div className="border-t border-gray-100 my-1" />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {commit.files_changed && commit.files_changed.length > 0 ? (
                              commit.files_changed.slice(0, 5).map((file, idx) => (
                                <span
                                  key={file + idx}
                                  className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-[11px] font-mono truncate max-w-[90px]"
                                  title={file}
                                >
                                  <FileTextIcon className="inline w-3 h-3 mr-0.5 align-text-bottom" />
                                  {file}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No files</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div>No commits found</div>
                )}
              </SidebarMenu>
            )}
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  );
};

export default Dashboard;