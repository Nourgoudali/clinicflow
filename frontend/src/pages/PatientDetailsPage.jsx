import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CalendarPlus,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatusBadge } from '@/components/appointments/AppointmentStatusBadge';
import { PatientFormModal } from '@/components/patients/PatientFormModal';
import { PatientDeleteModal } from '@/components/patients/PatientDeleteModal';
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal';
import { AppointmentStatusModal } from '@/components/appointments/AppointmentStatusModal';
import { patientService } from '@/services/patientService';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [editPatientOpen, setEditPatientOpen] = useState(false);
  const [deletePatientOpen, setDeletePatientOpen] = useState(false);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const loadPatient = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getPatientById(id);
      setPatient(data);
    } catch (error) {
      toast.error('Patient introuvable ou erreur de chargement');
      navigate('/patients');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  const handleOpenStatusModal = (appt) => {
    setSelectedAppointment({
      ...appt,
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        cin: patient.cin
      }
    });
    setStatusModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-1" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Back button and page title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link to="/patients">
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {patient.fullName}
            </h2>
            <p className="text-[11px] sm:text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
              <span>CIN : <strong className="font-mono text-foreground">{patient.cin}</strong></span>
              <span>•</span>
              <span>Créé le {formatDate(patient.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditPatientOpen(true)}
            className="text-xs gap-1.5 h-8 sm:h-9 flex-1 sm:flex-none"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button
            size="sm"
            onClick={() => setNewAppointmentOpen(true)}
            className="text-xs gap-1.5 h-8 sm:h-9 flex-1 sm:flex-none"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Nouveau RDV
          </Button>
          {isAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeletePatientOpen(true)}
              className="text-xs gap-1.5 h-8 sm:h-9 flex-1 sm:flex-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Patient Details + Appointments List */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Personal info card */}
        <Card className="lg:col-span-1 shadow-sm h-fit">
          <CardHeader className="p-4 sm:p-6 pb-3 border-b">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Fiche Signalétique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 p-4 sm:p-6 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Nom complet</span>
              <p className="font-semibold text-foreground text-sm">{patient.fullName}</p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Carte d'Identité Nationale (CIN)</span>
              <Badge variant="outline" className="font-mono mt-0.5 text-xs">
                {patient.cin}
              </Badge>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Téléphone</span>
              <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5 text-xs sm:text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{patient.phone}</span>
              </p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Date de naissance</span>
              <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5 text-xs sm:text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{formatDate(patient.birthDate)}</span>
              </p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Adresse</span>
              <p className="font-medium text-foreground flex items-start gap-1.5 mt-0.5 text-xs sm:text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{patient.address || 'Aucune adresse renseignée'}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Appointments History */}
        <Card className="lg:col-span-2 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-3 border-b">
            <div>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Historique des Rendez-vous
              </CardTitle>
              <CardDescription className="text-xs">
                Tous les rendez-vous de ce patient
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setNewAppointmentOpen(true)}
              className="text-xs gap-1 h-8 px-2.5"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {!patient.appointments || patient.appointments.length === 0 ? (
              <div className="py-12 text-center text-xs sm:text-sm text-muted-foreground p-4">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                Aucun rendez-vous n'est encore enregistré pour ce patient.
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setNewAppointmentOpen(true)}
                    className="text-xs"
                  >
                    Programmer une consultation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date & Heure</TableHead>
                      <TableHead className="text-xs">Motif & Remarques</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Créé par</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.appointments.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-muted/40">
                        <TableCell className="text-xs font-semibold whitespace-nowrap py-3">
                          {formatDateTime(appt.appointmentDate)}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs">
                          <p className="font-medium text-foreground">{appt.reason}</p>
                          {appt.notes && (
                            <p className="text-[11px] text-muted-foreground italic mt-0.5 truncate" title={appt.notes}>
                              Note : {appt.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                          {appt.creator?.email?.split('@')[0] || 'Système'}
                        </TableCell>
                        <TableCell>
                          <AppointmentStatusBadge status={appt.status} />
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenStatusModal(appt)}
                            className="h-7 text-xs px-2"
                          >
                            Statut
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Patient Modal */}
      <PatientFormModal
        open={editPatientOpen}
        onOpenChange={setEditPatientOpen}
        patient={patient}
        onSuccess={loadPatient}
      />

      {/* Delete Patient Modal */}
      <PatientDeleteModal
        open={deletePatientOpen}
        onOpenChange={setDeletePatientOpen}
        patient={patient}
        onSuccess={() => navigate('/patients')}
      />

      {/* New Appointment Modal */}
      <AppointmentFormModal
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        initialPatientId={patient.id}
        onSuccess={loadPatient}
      />

      {/* Appointment Status Change Modal */}
      <AppointmentStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        appointment={selectedAppointment}
        onSuccess={loadPatient}
      />
    </div>
  );
};
