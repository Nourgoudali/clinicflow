import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Activity, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().min(1, 'L’email est requis').email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(values.email, values.password);
      toast.success('Connexion réussie');
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Header Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Activity className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">ClinicFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plateforme professionnelle de gestion des patients et des rendez-vous
          </p>
        </div>

        <Card className="border-border/60 shadow-xl bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre espace de travail.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Adresse Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@clinicflow.com"
                    className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-9 ${errors.password ? 'border-destructive' : ''}`}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Se connecter
              </Button>
            </form>
          </CardContent>

          {/* Quick Demo Login Credentials Bar */}
          <CardFooter className="flex flex-col border-t bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Comptes de démonstration (Seed)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs justify-start h-auto py-1.5 px-2.5 flex-col items-start text-left"
                onClick={() => fillCredentials('admin@clinicflow.com', 'Admin123!')}
              >
                <span className="font-semibold text-primary">Admin</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">admin@clinicflow.com</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs justify-start h-auto py-1.5 px-2.5 flex-col items-start text-left"
                onClick={() => fillCredentials('staff1@clinicflow.com', 'Staff123!')}
              >
                <span className="font-semibold text-blue-600">Personnel (Staff)</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">staff1@clinicflow.com</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
