import GithubLoginButton from '../components/Auth/GithubLoginButton';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">GitSum</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sign in to continue</h2>
        <GithubLoginButton />
      </div>
    </div>
  );
};

export default Login;