import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Page non trouvée (404)</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        La page ou la ressource que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="default" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </Link>
    </div>
  );
};
