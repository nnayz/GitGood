import { CustomLayout } from '@/components/CustomLayout';
import NavigationBar from '@/components/NavigationBar';
import ChatInterface from '@/components/ChatInterface';

const Dashboard: React.FC = () => {
  return (
    <CustomLayout>
      <div className="flex flex-col h-full overflow-auto">
        <NavigationBar />
        <div className="flex-1 p-4">
          <ChatInterface />
        </div>
      </div>
    </CustomLayout>
  );
};

export default Dashboard;