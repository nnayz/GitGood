import React from 'react';
import { TypographyH2, TypographyH3, TypographySmall } from '@/components/ui/Typography';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Repository } from '@/models/repository';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useRepositoriesQueries, useAddRepository, useDeleteRepository } from '@/hooks/useRepositoriesQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronsUpDown, Loader2, ChevronLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RepositoriesSidebarProps {
    onRepositorySelect: (repositoryId: number) => void;
    selectedRepositoryId: number;
}

const RepositoriesSidebar: React.FC<RepositoriesSidebarProps> = ({ onRepositorySelect, selectedRepositoryId }) => {
    const { user, logout } = useAuth();
    const { data: repositories, isLoading: isLoadingRepositories } = useRepositoriesQueries();
    const { mutate: addRepository, isPending: isAddingRepository } = useAddRepository();
    const { mutate: deleteRepository, isPending: isDeletingRepository } = useDeleteRepository();
    const [isAddingRepositoryDialogOpen, setIsAddingRepositoryDialogOpen] = useState(false);
    const [repositoryUrl, setRepositoryUrl] = useState("");

    const handleImportRepository = () => {
        addRepository(repositoryUrl, {
          onSuccess: () => {
            setRepositoryUrl("");
            setIsAddingRepositoryDialogOpen(false);
            if (repositories && repositories.length > 0) {
              onRepositorySelect(repositories[repositories.length - 1].id);
            }
          },
          onError: (error) => {
            console.error(error);
          }
        });
    }

    const handleDeleteRepository = (repositoryId: number) => {
        deleteRepository(repositoryId, {
          onSuccess: () => {
            if (repositories && repositories.length > 0) {
              onRepositorySelect(repositories[repositories.length - 1].id);
            }
          }
        });
    }

    return (
      <>
        <div className="w-72 border-r border-border flex flex-col h-full bg-background">
          <div className="flex items-center justify-between border-b border-border p-2">
            <TypographyH2 title="GitSum" />
          </div>
          
          <div className="flex-1 flex flex-col overflow-auto p-2">
            <div className="flex items-center justify-between mb-2">
              <TypographyH3 title="Repositories" />
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAddingRepositoryDialogOpen(true)}>
                <PlusIcon className="w-4 h-4" />
              </div>
            </div>
            
            {isLoadingRepositories ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : (
              <ul className="space-y-1">
                {repositories?.map((repository: Repository) => (
                  <HoverCard key={repository.id}>
                    <HoverCardTrigger asChild>
                      <li 
                        onClick={() => onRepositorySelect(repository.id)} 
                        className={`cursor-pointer rounded-md p-2 text-left justify-between flex items-center ${repository.id === selectedRepositoryId ? 'bg-secondary' : ''}`}
                      >
                        <TypographySmall text={repository.name} />
                        {repository.id === selectedRepositoryId && <ChevronLeft className="w-4 h-4" />}
                      </li>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" sideOffset={8} className="w-72 p-4 bg-card text-card-foreground border border-border rounded-lg shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-foreground mb-1 truncate" title={repository.name}>{repository.name}</div>
                        {isDeletingRepository ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4 text-destructive hover:text-destructive/80" onClick={() => handleDeleteRepository(repository.id)} />}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2 truncate" title={repository.description}>{repository.description}</div>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground mb-1">
                        <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5">{repository.language}</span>
                        <span>by <span className="font-medium text-foreground">{repository.author}</span></span>
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground mb-1">
                        <span>Created: {new Date(repository.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(repository.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className={`text-xs text-primary truncate`}>
                        <a href={repository.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{repository.url}</a>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t border-border">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 justify-between w-full bg-inherit p-1 rounded-md cursor-pointer">
                  <div className="flex items-center gap-2 text-left">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback>{user?.login?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <TypographySmall text={user?.login ?? ""} />
                      <TypographySmall text={user?.name ?? ""} />
                    </div>
                  </div>
                  <ChevronsUpDown className="w-4 h-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent side="right" align="end" className="bg-popover text-popover-foreground border-border">
                <div className="flex flex-col gap-2">
                  <TypographySmall text={'Sign Out'} className="cursor-pointer hover:text-primary" onClick={logout} />
                  <TypographySmall text={'Settings'} className="cursor-pointer mt-1 hover:text-primary" />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Dialog open={isAddingRepositoryDialogOpen} onOpenChange={setIsAddingRepositoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Repository</DialogTitle>
              <DialogDescription>
                Add a repository to your account
              </DialogDescription>
              <Input placeholder="Repository URL" value={repositoryUrl} onChange={(e) => setRepositoryUrl(e.target.value)} />
            </DialogHeader>

            <DialogFooter>
              <Button onClick={handleImportRepository} disabled={isAddingRepository}>Import</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
}

export default RepositoriesSidebar;