import { useEffect, useState } from 'react';
import { getUserData, logout } from '../services/auth/github';
import { useNavigate } from 'react-router-dom';
import { SidebarGroup, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { TypographyH2, TypographyH3 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

const Dashboard= () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleGoback = () => {
    navigate(-1);
  }


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <TypographyH2 title="GitSum" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between">
                <TypographyH3 title="Repositories" />
                <Button variant="default" size="sm" onClick={handleGoback}>
                  <SidebarTrigger>
                    <ArrowLeftIcon className="w-4 h-4" />
                  </SidebarTrigger>
                </Button>
              </SidebarGroupLabel>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main>
        <SidebarTrigger className="absolute top-2 left-2 text-white" />
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;