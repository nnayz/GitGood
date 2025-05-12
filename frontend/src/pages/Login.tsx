import GithubLoginButton from '../components/Auth/GithubLoginButton';
import { ThemeToggle } from '../components/theme-toggle';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-foreground">GitSum</h1>
      <div className="bg-card p-8 rounded-lg shadow-md border border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Sign in to continue</h2>
        <GithubLoginButton />
      </div>
    </div>
  );
};

export default Login;