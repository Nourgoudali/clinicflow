import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

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
import { patientService } from '@/services/patientService';

const isNotFutureDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
};

const patientSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit comporter au moins 2 caractères'),
  cin: z.string().min(2, 'Le CIN doit comporter au moins 2 caractères').toUpperCase(),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^\d+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres.')
    .min(6, 'Le numéro de téléphone doit comporter au moins 6 chiffres'),
  birthDate: z
    .string()
    .min(1, 'La date de naissance est requise')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Format de date de naissance invalide'
    })
    .refine(isNotFutureDate, {
      message: 'La date de naissance ne peut pas être dans le futur.'
    }),
  address: z.string().optional()
});

export const PatientFormModal = ({
  open,
  onOpenChange,
  patient = null,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!patient;

  // Maximum allowed date is today
  const todayString = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      cin: '',
      phone: '',
      birthDate: '',
      address: ''
    }
  });

  useEffect(() => {
    if (patient) {
      reset({
        fullName: patient.fullName || '',
        cin: patient.cin || '',
        phone: patient.phone || '',
        birthDate: patient.birthDate ? patient.birthDate.split('T')[0] : '',
        address: patient.address || ''
      });
    } else {
      reset({
        fullName: '',
        cin: '',
        phone: '',
        birthDate: '',
        address: ''
      });
    }
  }, [patient, reset, open]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await patientService.updatePatient(patient.id, data);
        toast.success('Patient mis à jour avec succès');
      } else {
        await patientService.createPatient(data);
        toast.success('Nouveau patient enregistré avec succès');
      }
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || 'Une erreur est survenue lors de l’enregistrement';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier les informations du patient' : 'Ajouter un nouveau patient'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Mettez à jour les coordonnées et informations personnelles du patient.'
              : 'Remplissez les détails pour créer un nouveau dossier patient.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-xs">
              Nom complet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Ex: Fatima Zahra Benali"
              {...register('fullName')}
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cin" className="text-xs">
                CIN (Identifiant unique) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cin"
                placeholder="Ex: AB123456"
                {...register('cin')}
                className={errors.cin ? 'border-destructive' : ''}
              />
              {errors.cin && (
                <p className="mt-1 text-xs text-destructive">{errors.cin.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs">
                Téléphone (chiffres uniquement) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="Ex: 0612345678"
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="birthDate" className="text-xs">
              Date de naissance <span className="text-destructive">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              max={todayString}
              {...register('birthDate')}
              className={errors.birthDate ? 'border-destructive' : ''}
            />
            {errors.birthDate && (
              <p className="mt-1 text-xs text-destructive">{errors.birthDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address" className="text-xs">
              Adresse (Optionnel)
            </Label>
            <Input
              id="address"
              placeholder="Ex: 14 Boulevard d'Anfa, Casablanca"
              {...register('address')}
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
              {isEditing ? 'Enregistrer les modifications' : 'Créer le patient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
