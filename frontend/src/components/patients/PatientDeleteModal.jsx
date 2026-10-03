import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { patientService } from '@/services/patientService';

export const PatientDeleteModal = ({
  open,
  onOpenChange,
  patient,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!patient) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await patientService.deletePatient(patient.id);
      toast.success(`Le dossier de ${patient.fullName} a été supprimé`);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmer la suppression du patient</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer définitivement le dossier du patient{' '}
          <strong className="text-foreground">{patient.fullName}</strong> (CIN: {patient.cin}) ?
          <br /><br />
          Cette action est réservée aux administrateurs. Tous les rendez-vous associés seront également affectés.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)} disabled={isDeleting}>
          Annuler
        </AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} isLoading={isDeleting}>
          Supprimer définitivement
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};
