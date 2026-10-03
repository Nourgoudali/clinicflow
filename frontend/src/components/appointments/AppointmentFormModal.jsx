import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AlertCircle, Calendar } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { patientService } from '@/services/patientService';
import { appointmentService } from '@/services/appointmentService';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Veuillez sélectionner un patient'),
  date: z.string().min(1, 'La date est requise'),
  time: z.string().min(1, "L'heure est requise"),
  reason: z.string().min(2, 'Le motif doit comporter au moins 2 caractères'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled'])
});

export const AppointmentFormModal = ({
  open,
  onOpenChange,
  initialPatientId = null,
  appointment = null,
  onSuccess
}) => {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  const isEditing = !!appointment;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: initialPatientId || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      reason: '',
      notes: '',
      status: 'pending'
    }
  });

  useEffect(() => {
    if (open) {
      setConflictError(null);
      // Fetch patients for select dropdown
      const fetchPatients = async () => {
        setLoadingPatients(true);
        try {
          const res = await patientService.getPatients({ limit: 100 });
          setPatients(res.data || []);
        } catch (err) {
          toast.error('Erreur lors du chargement des patients');
        } finally {
          setLoadingPatients(false);
        }
      };
      fetchPatients();

      if (appointment) {
        const aptDate = new Date(appointment.appointmentDate);
        const yyyyMmDd = aptDate.toISOString().split('T')[0];
        const hhMm = aptDate.toTimeString().slice(0, 5);

        reset({
          patientId: appointment.patientId,
          date: yyyyMmDd,
          time: hhMm,
          reason: appointment.reason || '',
          notes: appointment.notes || '',
          status: appointment.status || 'pending'
        });
      } else {
        reset({
          patientId: initialPatientId || '',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          reason: '',
          notes: '',
          status: 'pending'
        });
      }
    }
  }, [open, appointment, initialPatientId, reset]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setConflictError(null);

    try {
      // Combine date and time to ISO string
      const fullIsoDate = new Date(`${values.date}T${values.time}:00`).toISOString();

      const payload = {
        patientId: values.patientId,
        appointmentDate: fullIsoDate,
        reason: values.reason,
        notes: values.notes,
        status: values.status
      };

      if (isEditing) {
        await appointmentService.updateAppointment(appointment.id, payload);
        toast.success('Rendez-vous mis à jour avec succès');
      } else {
        await appointmentService.createAppointment(payload);
        toast.success('Rendez-vous programmé avec succès');
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictError(error.response.data.message || 'Conflit de rendez-vous détecté (règle des 30 minutes).');
        toast.error('Règle des 30 minutes : Conflit détecté');
      } else {
        const msg = error.response?.data?.message || 'Erreur lors de l’enregistrement du rendez-vous';
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {isEditing ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Mettez à jour la date, l’heure ou le motif du rendez-vous.'
              : 'Planifiez une nouvelle consultation pour un patient.'}
          </DialogDescription>
        </DialogHeader>

        {conflictError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Conflit de rendez-vous (Règle 30 min)</p>
              <p className="text-xs mt-0.5">{conflictError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="patientId" className="text-xs">
              Patient <span className="text-destructive">*</span>
            </Label>
            <Select
              id="patientId"
              {...register('patientId')}
              disabled={!!initialPatientId || loadingPatients}
              className={errors.patientId ? 'border-destructive' : ''}
            >
              <option value="">Sélectionner un patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} (CIN: {p.cin})
                </option>
              ))}
            </Select>
            {errors.patientId && (
              <p className="mt-1 text-xs text-destructive">{errors.patientId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-xs">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className={errors.date ? 'border-destructive' : ''}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="time" className="text-xs">
                Heure <span className="text-destructive">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
                className={errors.time ? 'border-destructive' : ''}
              />
              {errors.time && (
                <p className="mt-1 text-xs text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-xs">
              Statut initial
            </Label>
            <Select id="status" {...register('status')}>
              <option value="pending">En attente (Pending)</option>
              <option value="confirmed">Confirmé (Confirmed)</option>
              <option value="cancelled">Annulé (Cancelled)</option>
            </Select>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Note : La confirmation applique la règle stricte des 30 minutes de battement.
            </p>
          </div>

          <div>
            <Label htmlFor="reason" className="text-xs">
              Motif de consultation <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              placeholder="Ex: Consultation générale, suivi tension..."
              {...register('reason')}
              className={errors.reason ? 'border-destructive' : ''}
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-destructive">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs">
              Remarques / Observations (Optionnel)
            </Label>
            <Input
              id="notes"
              placeholder="Ex: Patient à jeun, apporter résultats précédents..."
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Mettre à jour' : 'Programmer le rendez-vous'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
