import { Sidebar } from "./ui/sidebar"
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarGroup, SidebarGroupLabel, SidebarTrigger } from "./ui/sidebar"
import { TypographyH2, TypographyH3, TypographySmall } from "./ui/Typography"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { Repository } from "@/models/repository"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card"
import { SidebarMenuItem } from "./ui/sidebar"
import { useRepositoriesQueries } from "@/hooks/useRepositoriesQueries"

interface RepositoriesSidebarProps {
    onRepositorySelect: (repositoryId: number) => void;
}

const RepositoriesSidebar: React.FC<RepositoriesSidebarProps> = ({ onRepositorySelect }) => {
    const { data: repositories, isLoading: isLoadingRepositories } = useRepositoriesQueries();

    const handleSelectRepository = (repositoryId: number) => {
        onRepositorySelect(repositoryId);
    }
    return <Sidebar className='w-72'>
    <SidebarHeader>
      <TypographyH2 title="GitSum" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <TypographyH3 title="Repositories" />
              <SidebarTrigger>
                <ArrowLeftIcon className="w-4 h-4" />
              </SidebarTrigger>
          </SidebarGroupLabel>
          {isLoadingRepositories ? (
            <div>Loading...</div>
          ) : (
            <SidebarMenu>
              {repositories?.map((repository: Repository) => (
                <HoverCard key={repository.id}>
                  <HoverCardTrigger asChild>
                    <SidebarMenuItem onClick={() => handleSelectRepository(repository.id)} className="cursor-pointer">
                      <TypographySmall text={`${repository.author}/${repository.name}`} />
                    </SidebarMenuItem>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" sideOffset={8} className="w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="font-semibold text-gray-900 mb-1 truncate" title={repository.name}>{repository.name}</div>
                    <div className="text-xs text-gray-500 mb-2 truncate" title={repository.description}>{repository.description}</div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-600 mb-1">
                      <span className="bg-gray-100 rounded px-2 py-0.5">{repository.language}</span>
                      <span>by <span className="font-medium text-gray-800">{repository.author}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mb-1">
                      <span>Created: {new Date(repository.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(repository.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-blue-600 truncate">
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
  </Sidebar>
}

export default RepositoriesSidebar;