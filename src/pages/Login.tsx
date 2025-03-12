
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  const handleAuthSuccess = async () => {
    await refreshUser();
    navigate('/');
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <section className="pt-32 pb-16 px-6 flex-grow flex items-center">
        <div className="max-w-lg mx-auto w-full">
          <h1 className="text-3xl font-bold text-center mb-8">
            Authentication Required
          </h1>
          
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      </section>
      
      <footer className="py-10 px-6 bg-secondary/30 mt-auto">
        <div className="max-w-5xl mx-auto">
          <Separator className="mb-6" />
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Classroom Fraud Sentinel. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Login;
