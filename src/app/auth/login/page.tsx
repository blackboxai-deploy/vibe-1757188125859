'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-2xl text-green-600">FutMap</span>
          </Link>
          <p className="text-gray-600 mt-2">Entre na sua conta</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <p className="text-sm text-gray-600">
              Entre com suas credenciais para acessar sua conta
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-green-600 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/auth/signup" className="text-green-600 hover:underline font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Demo</h4>
              <p className="text-sm text-blue-700 mb-2">
                Use as credenciais abaixo para testar:
              </p>
              <div className="text-sm font-mono bg-blue-100 p-2 rounded">
                <div>Email: demo@futmap.com</div>
                <div>Senha: demo123</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-blue-600 hover:text-blue-700"
                onClick={() => {
                  setEmail('demo@futmap.com');
                  setPassword('demo123');
                }}
              >
                Preencher dados demo
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            ← Voltar para o mapa
          </Link>
        </div>
      </div>
    </div>
  );
}