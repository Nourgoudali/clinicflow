import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  Filter,
  AlertCircle,
  X,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatusBadge } from '@/components/appointments/AppointmentStatusBadge';
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal';
import { AppointmentStatusModal } from '@/components/appointments/AppointmentStatusModal';
import { appointmentService } from '@/services/appointmentService';
import { formatDateTime } from '@/lib/utils';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getAppointments({
        status: statusFilter || undefined,
        date: dateFilter || undefined
      });
      const list = Array.isArray(data) ? data : (data.data || []);
      setAppointments(list);
    } catch (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleOpenAdd = () => {
    setAppointmentToEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (appt) => {
    setAppointmentToEdit(appt);
    setFormModalOpen(true);
  };

  const handleOpenStatus = (appt) => {
    setSelectedAppointment(appt);
    setStatusModalOpen(true);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setDateFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Gestion des Rendez-vous
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Planifiez, filtrez et mettez à jour le statut des consultations de la clinique.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="w-full sm:w-auto gap-2 shadow-sm">
          <CalendarPlus className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold uppercase text-muted-foreground">Filtres :</span>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 text-xs w-full"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente (Pending)</option>
              <option value="confirmed">Confirmé (Confirmed)</option>
              <option value="cancelled">Annulé (Cancelled)</option>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="w-full sm:w-48">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 text-xs w-full"
              placeholder="Filtrer par date"
            />
          </div>

          {(statusFilter || dateFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 justify-start sm:justify-center"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-muted-foreground pt-2 sm:pt-0 border-t sm:border-t-0">
          <span>{appointments.length} rendez-vous</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadAppointments}
            className="h-8 w-8"
            title="Rafraîchir"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-16 text-center px-4">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-semibold text-foreground">Aucun rendez-vous trouvé</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {statusFilter || dateFilter
                ? 'Aucun rendez-vous ne correspond à vos filtres sélectionnés.'
                : 'Aucune consultation n’est planifiée pour le moment.'}
            </p>
            {(statusFilter || dateFilter) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4 text-xs">
                Effacer les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date & Heure</TableHead>
                  <TableHead className="text-xs">Patient</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Motif & Notes</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Créé par</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold text-foreground whitespace-nowrap text-xs py-3">
                      {formatDateTime(appt.appointmentDate)}
                    </TableCell>
                    <TableCell>
                      {appt.patient ? (
                        <div>
                          <Link
                            to={`/patients/${appt.patient.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors text-xs block"
                          >
                            {appt.patient.fullName}
                          </Link>
                          <span className="block text-[11px] font-mono text-muted-foreground">
                            CIN: {appt.patient.cin}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Patient supprimé</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs hidden md:table-cell max-w-xs">
                      <p className="font-medium text-foreground">{appt.reason}</p>
                      {appt.notes && (
                        <p className="text-[11px] text-muted-foreground italic mt-0.5 truncate" title={appt.notes}>
                          Note : {appt.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={appt.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                      {appt.creator?.email?.split('@')[0] || 'Personnel'}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenStatus(appt)}
                          className="h-8 text-xs px-2 sm:px-3"
                        >
                          Statut
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(appt)}
                          className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                        >
                          Modifier
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Appointment Create/Edit Modal */}
      <AppointmentFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        appointment={appointmentToEdit}
        onSuccess={loadAppointments}
      />

      {/* Appointment Status Change Modal */}
      <AppointmentStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        appointment={selectedAppointment}
        onSuccess={loadAppointments}
      />
    </div>
  );
};
