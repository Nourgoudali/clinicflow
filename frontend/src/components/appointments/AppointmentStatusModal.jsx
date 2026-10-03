import React, { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { appointmentService } from '@/services/appointmentService';

export const AppointmentStatusModal = ({
  open,
  onOpenChange,
  appointment,
  onSuccess
}) => {
  const [selectedStatus, setSelectedStatus] = useState(appointment?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  React.useEffect(() => {
    if (appointment) {
      setSelectedStatus(appointment.status);
      setConflictError(null);
    }
  }, [appointment, open]);

  if (!appointment) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    setConflictError(null);
    try {
      await appointmentService.updateAppointmentStatus(appointment.id, selectedStatus);
      toast.success(`Statut mis à jour : ${selectedStatus}`);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictError(
          error.response.data.message ||
            'Conflit : ce patient a déjà un rendez-vous confirmé dans un intervalle de 30 minutes.'
        );
        toast.error('Règle des 30 minutes : Conflit détecté');
      } else {
        const msg = error.response?.data?.message || 'Erreur lors du changement de statut';
        toast.error(msg);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = [
    {
      value: 'confirmed',
      label: 'Confirmer',
      icon: CheckCircle2,
      desc: 'Valide le rendez-vous (soumis à la règle des 30 min)',
      activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
    },
    {
      value: 'pending',
      label: 'En attente',
      icon: Clock,
      desc: 'En attente de validation ou confirmation patient',
      activeClass: 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100'
    },
    {
      value: 'cancelled',
      label: 'Annuler',
      icon: XCircle,
      desc: 'Libère le créneau du patient',
      activeClass: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Changer le statut du rendez-vous</DialogTitle>
          <DialogDescription>
            Patient : <strong>{appointment.patient?.fullName || 'Patient'}</strong>
          </DialogDescription>
        </DialogHeader>

        {conflictError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Conflit détecté (Règle des 30 minutes)</p>
              <p className="text-xs mt-0.5">{conflictError}</p>
            </div>
          </div>
        )}

        <div className="space-y-3 py-2">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedStatus === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? opt.activeClass
                    : 'hover:bg-muted/40 border-border text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Annuler
          </Button>
          <Button onClick={handleUpdate} isLoading={isUpdating}>
            Mettre à jour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
