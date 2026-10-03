import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { PatientFormModal } from '@/components/patients/PatientFormModal';
import { PatientDeleteModal } from '@/components/patients/PatientDeleteModal';
import { patientService } from '@/services/patientService';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export const PatientsPage = () => {
  const { isAdmin } = useAuth();
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await patientService.getPatients({
        search: debouncedSearch,
        page: pagination.page,
        limit: pagination.limit
      });
      setPatients(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des patients');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, pagination.page, pagination.limit]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleOpenAdd = () => {
    setPatientToEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setPatientToEdit(patient);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (patient) => {
    if (!isAdmin) {
      toast.error('Action interdite : Seul un administrateur peut supprimer un patient');
      return;
    }
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Gestion des Patients
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Consultez, recherchez et gérez les dossiers des patients enregistrés.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="w-full sm:w-auto gap-2 shadow-sm">
          <UserPlus className="h-4 w-4" />
          Ajouter un patient
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par Nom complet ou CIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-input bg-background w-full text-xs sm:text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground flex items-center justify-between sm:justify-end">
          <span>Total : <strong className="text-foreground">{pagination.total}</strong> patient(s)</span>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="py-16 text-center px-4">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-semibold text-foreground">Aucun patient trouvé</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? `Aucun résultat pour la recherche "${search}".`
                : 'Commencez par ajouter votre premier patient dans la clinique.'}
            </p>
            {search && (
              <Button variant="outline" size="sm" onClick={() => setSearch('')} className="mt-4 text-xs">
                Effacer la recherche
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nom complet</TableHead>
                  <TableHead className="text-xs">CIN</TableHead>
                  <TableHead className="text-xs">Téléphone</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Date de naissance</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Adresse</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold text-foreground py-3">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="hover:text-primary transition-colors text-xs sm:text-sm block"
                      >
                        {patient.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[11px] font-medium">
                        {patient.cin}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{patient.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(patient.birthDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[180px] truncate" title={patient.address}>
                      {patient.address || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/patients/${patient.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Voir détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(patient)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {isAdmin ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(patient)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Supprimer (Admin)"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className="h-8 w-8 opacity-30 cursor-not-allowed"
                            title="Suppression réservée à l'administrateur"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Database-level Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>

      {/* Form Dialog */}
      <PatientFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        patient={patientToEdit}
        onSuccess={loadPatients}
      />

      {/* Delete Confirmation Dialog */}
      <PatientDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        patient={patientToDelete}
        onSuccess={loadPatients}
      />
    </div>
  );
};
