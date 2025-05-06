import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth/github';
import GithubCallback from './components/Auth/GithubCallback';
import AuthGuard from './components/Auth/AuthGuard';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isAuthenticated() ? 
            <AuthGuard><Home /></AuthGuard> : 
            <Navigate to="/login" replace />
        } />
        <Route path="/login" element={
          !isAuthenticated() ? 
            <Login /> : 
            <Navigate to="/" replace />
        } />
        <Route path="/auth/callback" element={<GithubCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;