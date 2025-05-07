import { useEffect, useState } from 'react';
import { getUserData, logout } from '../services/auth/github';

interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">GitSum Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={user.avatar_url} 
              alt={user.name || user.login} 
              className="w-8 h-8 rounded-full"
            />
            <span>{user.name || user.login}</span>
          </div>
          <button 
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name || user.login}!</h2>
        <p>You've successfully signed in with GitHub.</p>
      </div>
    </div>
  );
};

export default Home;