import { Sidebar, SidebarFooter } from "./ui/sidebar"
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarGroup, SidebarGroupLabel } from "./ui/sidebar"
import { TypographyH2, TypographyH3, TypographySmall } from "./ui/Typography"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { Repository } from "@/models/repository"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card"
import { SidebarMenuItem } from "./ui/sidebar"
import { useRepositoriesQueries, useAddRepository, useDeleteRepository } from "@/hooks/useRepositoriesQueries"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button"
import { useState } from "react"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { ChevronsUpDown, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ChevronLeft } from "lucide-react"
import { useSidebar } from "./ui/sidebar"


interface RepositoriesSidebarProps {
    onRepositorySelect: (repositoryId: number) => void;
    selectedRepositoryId: number;
}

const RepositoriesSidebar: React.FC<RepositoriesSidebarProps> = ({ onRepositorySelect, selectedRepositoryId }) => {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const { data: repositories, isLoading: isLoadingRepositories } = useRepositoriesQueries();
    const { mutate: addRepository, isPending: isAddingRepository } = useAddRepository();
    const { mutate: deleteRepository, isPending: isDeletingRepository } = useDeleteRepository();
    const [isAddingRepositoryDialogOpen, setIsAddingRepositoryDialogOpen] = useState(false);
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const { logout } = useAuth();
    const handleSelectRepository = (repositoryId: number) => {
        onRepositorySelect(repositoryId);
    }

    const handleImportRepository = () => {
        addRepository(repositoryUrl, {
          onSuccess: () => {
            setRepositoryUrl("");
            setIsAddingRepositoryDialogOpen(false);
            onRepositorySelect(repositories[repositories.length - 1].id);
          },
          onError: (error) => {
            console.error(error);
          }
        });
    }

    const handleDeleteRepository = (repositoryId: number) => {
        deleteRepository(repositoryId, {
          onSuccess: () => {
            onRepositorySelect(repositories[repositories.length - 1].id);
          }
        });
    }

    return <Sidebar className='w-72 flex flex-col h-full'>
    <SidebarHeader>
      <div className="flex items-center justify-between border-b">
      <TypographyH2 title="GitSum" />
      <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSidebar}>
        <ArrowLeftIcon className="w-4 h-4" />
      </div>
      </div>
      
    </SidebarHeader>
    <SidebarContent className="flex-1 flex flex-col">
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <TypographyH3 title="Repositories" />
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAddingRepositoryDialogOpen(true)}>
              <PlusIcon className="w-4 h-4" />
            </div>
          </SidebarGroupLabel>
          {isLoadingRepositories ? (
            <div>Loading...</div>
          ) : (
            <SidebarMenu>
              {repositories?.map((repository: Repository) => (
                <HoverCard key={repository.id}>
                  <HoverCardTrigger asChild>
                    <SidebarMenuItem onClick={() => handleSelectRepository(repository.id)} className={`cursor-pointer rounded-md p-2 text-left justify-between flex items-center`}>
                      <TypographySmall text={repository.name} />
                      {repository.id === selectedRepositoryId && <ChevronLeft className="w-4 h-4" />}
                    </SidebarMenuItem>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" sideOffset={8} className="w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900 mb-1 truncate" title={repository.name}>{repository.name}</div>
                      {isDeletingRepository ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" onClick={() => handleDeleteRepository(repository.id)} />}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 truncate" title={repository.description}>{repository.description}</div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-600 mb-1">
                      <span className="bg-gray-100 rounded px-2 py-0.5">{repository.language}</span>
                      <span>by <span className="font-medium text-gray-800">{repository.author}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mb-1">
                      <span>Created: {new Date(repository.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(repository.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`text-xs text-blue-600 truncate ${repository.id === selectedRepositoryId ? "bg-gray" : ""}`}>
                      <a href={repository.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{repository.url}</a>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroup>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter className="flex items-center justify-center">
      <Popover>
      <PopoverTrigger asChild>
      <div className="flex items-center gap-2 justify-between w-full bg-gray-200 p-1 rounded-md cursor-pointer">
        <div className="flex items-center gap-2 text-left">
      <Avatar className="w-8 h-8">
        <AvatarImage src={user?.avatar_url} />
        <AvatarFallback>{user?.login.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <TypographySmall text={user?.login ?? ""} />
        <TypographySmall text={user?.name ?? ""} />
      </div>
      </div>
          <ChevronsUpDown className="w-4 h-4" />
      </div>
      </PopoverTrigger>
      <PopoverContent side="right" align="end">
        <div className="flex flex-col gap-2">
          <TypographySmall text={'Sign Out'} className="cursor-pointer" onClick={logout} />
          <TypographySmall text={'Settings'} className="cursor-pointer mt-1" />
        </div>
      </PopoverContent>
      </Popover>
    </SidebarFooter>
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
  </Sidebar>
}

export default RepositoriesSidebar;