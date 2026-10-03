import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const AppointmentStatusBadge = ({ status }) => {
  switch (status) {
    case 'confirmed':
      return (
        <Badge variant="success" className="gap-1 font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Confirmé
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="destructive" className="gap-1 font-medium">
          <XCircle className="h-3 w-3" />
          Annulé
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="warning" className="gap-1 font-medium">
          <Clock className="h-3 w-3" />
          En attente
        </Badge>
      );
  }
};
