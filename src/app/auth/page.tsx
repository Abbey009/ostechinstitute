import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to TechStack Academy</h1>
      <AuthForm />
    </main>
  );
}
