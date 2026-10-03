import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  CalendarPlus,
  UserPlus,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import { toast } from 'sonner';

import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatusBadge } from '@/components/appointments/AppointmentStatusBadge';
import { PatientFormModal } from '@/components/patients/PatientFormModal';
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal';
import { dashboardService } from '@/services/dashboardService';
import { appointmentService } from '@/services/appointmentService';
import { formatDateTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, appointmentsData] = await Promise.all([
        dashboardService.getStats(),
        appointmentService.getAppointments({ limit: 5 })
      ]);
      setStats(statsData);
      const list = Array.isArray(appointmentsData) ? appointmentsData : (appointmentsData.data || []);
      setRecentAppointments(list);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques du tableau de bord');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Bonjour, {user?.email?.split('@')[0]}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Voici l’activité de votre clinique pour aujourd’hui.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPatientModalOpen(true)}
            className="flex-1 sm:flex-none gap-2 text-xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Nouveau Patient
          </Button>
          <Button
            size="sm"
            onClick={() => setAppointmentModalOpen(true)}
            className="flex-1 sm:flex-none gap-2 text-xs"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Nouveau Rendez-vous
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="p-5 sm:p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Patients"
              value={stats?.totalPatients ?? 0}
              icon={Users}
              colorScheme="teal"
              description="Dossiers médicaux enregistrés"
            />
            <StatCard
              title="Rendez-vous du jour"
              value={stats?.todayAppointments ?? 0}
              icon={CalendarDays}
              colorScheme="blue"
              description="Programmés pour aujourd'hui"
            />
            <StatCard
              title="En attente (Pending)"
              value={stats?.pendingAppointments ?? 0}
              icon={Clock}
              colorScheme="amber"
              description="À confirmer ou replanifier"
            />
            <StatCard
              title="Confirmés (Confirmed)"
              value={stats?.confirmedAppointments ?? 0}
              icon={CheckCircle2}
              colorScheme="emerald"
              description="Règle 30 min validée"
            />
          </>
        )}
      </div>

      {/* Agenda & Overview Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent appointments table */}
        <Card className="lg:col-span-2 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6">
            <div>
              <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Derniers Rendez-vous
              </CardTitle>
              <CardDescription className="text-xs">
                Aperçu des consultations les plus récentes ou prochaines
              </CardDescription>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary h-8 px-2">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {isLoading ? (
              <div className="space-y-3 p-4 sm:p-0">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="py-12 text-center text-xs sm:text-sm text-muted-foreground p-4">
                Aucun rendez-vous enregistré pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Patient</TableHead>
                      <TableHead className="text-xs">Date & Heure</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Motif</TableHead>
                      <TableHead className="text-xs">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.slice(0, 5).map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium text-foreground py-3">
                          {appt.patient ? (
                            <Link
                              to={`/patients/${appt.patient.id}`}
                              className="hover:underline text-primary text-xs font-semibold block"
                            >
                              {appt.patient.fullName}
                            </Link>
                          ) : (
                            <span className="text-xs">Patient</span>
                          )}
                          <span className="block text-[11px] text-muted-foreground">
                            {appt.patient?.cin || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">
                          {formatDateTime(appt.appointmentDate)}
                        </TableCell>
                        <TableCell className="text-xs hidden md:table-cell max-w-[200px] truncate" title={appt.reason}>
                          {appt.reason}
                        </TableCell>
                        <TableCell>
                          <AppointmentStatusBadge status={appt.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info & Business Rules Summary Card */}
        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold">Règles & Accès Rapides</CardTitle>
            <CardDescription className="text-xs">Rappel des contrôles de gestion clinique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-6 pt-0 text-xs">
            <div className="rounded-lg border bg-muted/40 p-3">
              <h5 className="font-semibold text-foreground flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                <Clock className="h-4 w-4" />
                Règle des 30 minutes
              </h5>
              <p className="mt-1 text-muted-foreground leading-relaxed text-[11px]">
                Un patient ne peut avoir deux consultations confirmées avec un intervalle inférieur à 30 minutes. Le système applique cette règle automatiquement.
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <h5 className="font-semibold text-foreground flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-400">
                <Users className="h-4 w-4" />
                Droits d'accès (RBAC)
              </h5>
              <p className="mt-1 text-muted-foreground leading-relaxed text-[11px]">
                Le personnel peut créer et modifier les dossiers. Seul l'administrateur possède le droit de suppression définitive.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link to="/patients" className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                  <span>Annuaire des patients</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/appointments" className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                  <span>Tous les rendez-vous</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <PatientFormModal
        open={patientModalOpen}
        onOpenChange={setPatientModalOpen}
        onSuccess={loadDashboardData}
      />

      <AppointmentFormModal
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};
