import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  User,
  Stethoscope,
  Building2,
  Dumbbell,
  Search,
  Plus,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';

type UserRole = 'patients' | 'doctors' | 'hospitals' | 'trainers';
type FormMode = 'create' | 'edit';

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  patients: User,
  doctors: Stethoscope,
  hospitals: Building2,
  trainers: Dumbbell,
};

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  helperText?: string;
  fullWidth?: boolean;
}

const DEFAULT_PATIENT = {
  id: '',
  name: '',
  email: '',
  phone: '',
  age: '0',
  gender: 'Male',
  bloodGroup: '',
  address: '',
};

const DEFAULT_DOCTOR = {
  id: '',
  name: '',
  email: '',
  phone: '',
  specialization: '',
  qualification: '',
  experience: '0',
  consultationFee: '0',
  status: 'pending',
  hospitalId: '',
};

const DEFAULT_HOSPITAL = {
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  registrationNumber: '',
  status: 'pending',
};

const DEFAULT_TRAINER = {
  id: '',
  name: '',
  email: '',
  phone: '',
  trainerType: 'Fitness',
  experienceYears: '0',
  location: '',
  pricePerSession: '0',
  specialties: '',
  languages: '',
  modes: 'virtual,in-person',
  status: 'pending',
};

export const UserManagement = () => {
  const {
    patients,
    doctors,
    hospitals,
    trainers,
    addPatient,
    updatePatient,
    deletePatient,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addHospital,
    updateHospital,
    deleteHospital,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    refreshData,
  } = useAppStore();

  const [activeRole, setActiveRole] = useState<UserRole>('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [formValues, setFormValues] = useState<Record<string, any>>(DEFAULT_PATIENT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hospital deletion dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<any>(null);
  const [deletionMode, setDeletionMode] = useState<'unlink' | 'deleteAll'>('unlink');

  const datasets = {
    patients,
    doctors,
    hospitals,
    trainers,
  };

  const counts = {
    patients: patients.length,
    doctors: doctors.length,
    hospitals: hospitals.length,
    trainers: trainers.length,
  };

  const filteredData = useMemo(() => {
    const collection = datasets[activeRole] || [];
    if (!searchTerm.trim()) return collection;

    const term = searchTerm.toLowerCase();
    return collection.filter((item: any) =>
      Object.values(item).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(term),
      ),
    );
  }, [datasets, activeRole, searchTerm]);

  const fieldConfigs: Record<UserRole, FieldConfig[]> = {
    patients: [
      { name: 'name', label: 'Full Name', placeholder: 'John Doe' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
      { name: 'phone', label: 'Phone', placeholder: '+1 555 0100' },
      { name: 'age', label: 'Age', type: 'number' },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' },
        ],
      },
      { name: 'bloodGroup', label: 'Blood Group', placeholder: 'O+' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
    doctors: [
      { name: 'name', label: 'Full Name' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'specialization', label: 'Specialization', placeholder: 'Cardiology' },
      { name: 'qualification', label: 'Qualification', placeholder: 'MBBS, MD' },
      { name: 'experience', label: 'Experience (years)', type: 'number' },
      { name: 'consultationFee', label: 'Consultation Fee', type: 'number' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'suspended', label: 'Suspended' },
        ],
      },
      {
        name: 'hospitalId',
        label: 'Hospital ID',
        placeholder: 'Optional hospital reference',
        helperText: 'Provide a hospital ID to associate this doctor with a facility.',
        fullWidth: true,
      },
    ],
    hospitals: [
      { name: 'name', label: 'Hospital Name' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'city', label: 'City' },
      { name: 'state', label: 'State' },
      { name: 'registrationNumber', label: 'Registration Number' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ],
      },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
    trainers: [
      { name: 'name', label: 'Full Name' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'trainerType', label: 'Trainer Type', placeholder: 'Yoga Instructor' },
      { name: 'experienceYears', label: 'Experience (years)', type: 'number' },
      { name: 'location', label: 'Location' },
      { name: 'pricePerSession', label: 'Price per Session', type: 'number' },
      {
        name: 'specialties',
        label: 'Specialties',
        placeholder: 'Comma separated values',
        fullWidth: true,
      },
      {
        name: 'languages',
        label: 'Languages',
        placeholder: 'Comma separated values',
        fullWidth: true,
      },
      {
        name: 'modes',
        label: 'Modes',
        placeholder: 'virtual,in-person',
        helperText: 'Comma separated values (e.g., virtual,in-person)',
        fullWidth: true,
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'suspended', label: 'Suspended' },
        ],
      },
    ],
  };

  const openCreateDialog = (role: UserRole) => {
    setFormMode('create');
    setSelectedId(null);
    setActiveRole(role);
    switch (role) {
      case 'patients':
        setFormValues(DEFAULT_PATIENT);
        break;
      case 'doctors':
        setFormValues(DEFAULT_DOCTOR);
        break;
      case 'hospitals':
        setFormValues(DEFAULT_HOSPITAL);
        break;
      case 'trainers':
        setFormValues(DEFAULT_TRAINER);
        break;
      default:
        setFormValues({});
    }
    setIsDialogOpen(true);
  };

  const openEditDialog = (role: UserRole, entity: any) => {
    setFormMode('edit');
    setActiveRole(role);
    setSelectedId(entity.id);

    if (role === 'trainers') {
      setFormValues({
        ...entity,
        specialties: Array.isArray(entity.specialties) ? entity.specialties.join(', ') : '',
        languages: Array.isArray(entity.languages) ? entity.languages.join(', ') : '',
        modes: Array.isArray(entity.modes) ? entity.modes.join(',') : 'virtual',
        experienceYears: String(entity.experienceYears ?? 0),
        pricePerSession: String(entity.pricePerSession ?? 0),
      });
    } else if (role === 'patients') {
      setFormValues({
        ...entity,
        age: String(entity.age ?? 0),
      });
    } else if (role === 'doctors') {
      setFormValues({
        ...entity,
        experience: String(entity.experience ?? 0),
        consultationFee: String(entity.consultationFee ?? 0),
      });
    } else if (role === 'hospitals') {
      setFormValues({
        ...entity,
      });
    } else {
      setFormValues(entity);
    }

    setIsDialogOpen(true);
  };

  const generateId = () =>
    (crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2, 10));

  const getPayload = () => {
    if (activeRole === 'patients') {
      return {
        id: selectedId ?? generateId(),
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        age: Number(formValues.age) || 0,
        gender: formValues.gender,
        bloodGroup: formValues.bloodGroup,
        address: formValues.address,
        createdAt: new Date().toISOString(),
      };
    }

    if (activeRole === 'doctors') {
      return {
        id: selectedId ?? generateId(),
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        specialization: formValues.specialization,
        qualification: formValues.qualification,
        experience: Number(formValues.experience) || 0,
        consultationFee: Number(formValues.consultationFee) || 0,
        status: formValues.status,
        hospitalId: formValues.hospitalId || undefined,
        available: true,
        rating: formValues.rating || 0,
      };
    }

    if (activeRole === 'hospitals') {
      return {
        id: selectedId ?? generateId(),
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address,
        city: formValues.city,
        state: formValues.state,
        registrationNumber: formValues.registrationNumber,
        status: formValues.status,
        totalDoctors: formValues.totalDoctors ?? 0,
      };
    }

    return {
      id: selectedId ?? generateId(),
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      trainerType: formValues.trainerType?.toUpperCase() || 'FITNESS',
      experienceYears: Number(formValues.experienceYears) || 0,
      location: formValues.location || '',
      pricePerSession: Number(formValues.pricePerSession) || 0,
      specialties: formValues.specialties
        ? formValues.specialties.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [],
      languages: formValues.languages
        ? formValues.languages.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [],
      modes: formValues.modes
        ? formValues.modes.split(',').map((item: string) => item.trim()).filter(Boolean)
        : ['virtual'],
      status: formValues.status ?? 'pending',
      image: '', // Default empty image
      rating: 0.0,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = getPayload();

    try {
      if (activeRole === 'patients') {
        if (formMode === 'create') {
          await addPatient(payload as any);
        } else if (selectedId) {
          await updatePatient(selectedId, payload as any);
        }
      } else if (activeRole === 'doctors') {
        if (formMode === 'create') {
          await addDoctor(payload as any);
        } else if (selectedId) {
          await updateDoctor(selectedId, payload as any);
        }
      } else if (activeRole === 'hospitals') {
        if (formMode === 'create') {
          await addHospital(payload as any);
        } else if (selectedId) {
          await updateHospital(selectedId, payload as any);
        }
      } else if (activeRole === 'trainers') {
        if (formMode === 'create') {
          await addTrainer(payload as any);
        } else if (selectedId) {
          await updateTrainer(selectedId, payload as any);
        }
      }

      await refreshData();
      toast.success(`User ${formMode === 'create' ? 'created' : 'updated'} successfully`);
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Unable to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (role: UserRole, id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      if (role === 'patients') {
        await deletePatient(id);
      } else if (role === 'doctors') {
        await deleteDoctor(id);
      } else if (role === 'hospitals') {
        // Don't delete directly, open the dialog instead
        return;
      } else if (role === 'trainers') {
        await deleteTrainer(id);
      }
      await refreshData();
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Unable to delete user');
    }
  };

  const handleHospitalDeleteClick = (hospital: any) => {
    setHospitalToDelete(hospital);
    setDeletionMode('unlink');
    setDeleteDialogOpen(true);
  };

  const confirmHospitalDeletion = async () => {
    if (!hospitalToDelete) return;

    try {
      await deleteHospital(hospitalToDelete.id, deletionMode);
      await refreshData();
      toast.success('Hospital deleted successfully');
      setDeleteDialogOpen(false);
      setHospitalToDelete(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to delete hospital');
    }
  };

  const handleSuspend = async (role: UserRole, id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'approved' : 'suspended';
    const action = newStatus === 'suspended' ? 'suspend' : 'activate';
    const confirmed = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirmed) return;

    try {
      // Get the current user data
      const currentUser = datasets[role].find((u: any) => u.id === id);
      if (!currentUser) {
        toast.error('User not found');
        return;
      }

      // Update with new status - properly typed for each entity
      const updatedUser = { ...currentUser, status: newStatus as any };

      if (role === 'patients') {
        await updatePatient(id, updatedUser);
      } else if (role === 'doctors') {
        await updateDoctor(id, updatedUser);
      } else if (role === 'hospitals') {
        await updateHospital(id, updatedUser);
      } else if (role === 'trainers') {
        await updateTrainer(id, updatedUser);
      }

      await refreshData();
      toast.success(`User ${action}d successfully`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || `Unable to ${action} user`);
    }
  };

  const renderTableRow = (item: any) => {
    if (activeRole === 'patients') {
      return (
        <>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.phone}</TableCell>
          <TableCell>{item.age}</TableCell>
          <TableCell>{item.gender}</TableCell>
        </>
      );
    }

    if (activeRole === 'doctors') {
      return (
        <>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>{item.specialization}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.phone}</TableCell>
          <TableCell>
            <Badge
              variant={
                item.status === 'approved'
                  ? 'default'
                  : item.status === 'pending'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {item.status}
            </Badge>
          </TableCell>
        </>
      );
    }

    if (activeRole === 'hospitals') {
      return (
        <>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.phone}</TableCell>
          <TableCell>{item.registrationNumber}</TableCell>
          <TableCell>
            <Badge
              variant={
                item.status === 'approved'
                  ? 'default'
                  : item.status === 'pending'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {item.status}
            </Badge>
          </TableCell>
        </>
      );
    }

    return (
      <>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.phone}</TableCell>
        <TableCell>{item.trainerType}</TableCell>
        <TableCell>₹{item.pricePerSession}</TableCell>
        <TableCell>
          <Badge
            variant={
              item.status === 'approved'
                ? 'default'
                : item.status === 'pending'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {item.status}
          </Badge>
        </TableCell>
      </>
    );
  };

  const renderTableHeaders = () => {
    if (activeRole === 'patients') {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
        </>
      );
    }
    if (activeRole === 'doctors') {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
        </>
      );
    }
    if (activeRole === 'hospitals') {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Registration</TableHead>
          <TableHead>Status</TableHead>
        </>
      );
    }
    return (
      <>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Status</TableHead>
      </>
    );
  };

  const activeFields = fieldConfigs[activeRole];
  const ActiveIcon = roleIcons[activeRole];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">User Management</h1>
          <p className="text-slate-600">
            Create, edit, or remove any user across patients, doctors, hospitals, and trainers.
          </p>
        </div>
        <Button onClick={() => openCreateDialog(activeRole)} className="gap-2">
          <Plus className="h-4 w-4" />
          New {activeRole.slice(0, -1)}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(counts) as UserRole[]).map((role) => {
          const Icon = roleIcons[role];
          return (
            <Card
              key={role}
              className={`cursor-pointer border ${activeRole === role ? 'border-slate-900' : 'border-slate-200'
                }`}
              onClick={() => setActiveRole(role)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">{counts[role]}</div>
                    <p className="text-sm text-slate-500 capitalize">{role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 capitalize">
              <ActiveIcon className="h-5 w-5 text-slate-600" />
              {activeRole}
            </CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`Search ${activeRole}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {renderTableHeaders()}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item: any) => (
                  <TableRow key={item.id}>
                    {renderTableRow(item)}
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openEditDialog(activeRole, item)}
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {(activeRole === 'doctors' || activeRole === 'hospitals' || activeRole === 'trainers') && (
                        <Button
                          size="icon"
                          variant="outline"
                          className={item.status === 'suspended' ? 'text-green-600' : 'text-orange-600'}
                          onClick={() => handleSuspend(activeRole, item.id, item.status)}
                          title={item.status === 'suspended' ? 'Activate' : 'Suspend'}
                        >
                          {item.status === 'suspended' ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Ban className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => activeRole === 'hospitals' ? handleHospitalDeleteClick(item) : handleDelete(activeRole, item.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length === 0 && (
            <div className="py-12 text-center text-slate-500">No records found</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {formMode === 'create' ? 'Create' : 'Edit'} {activeRole.slice(0, -1)}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create' ? 'Create a new' : 'Update the'} {activeRole.slice(0, -1)} record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Managing: <span className="font-medium capitalize">{activeRole}</span>
            </p>
            <div className="max-h-[65vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFields.map((field) => {
                  const isTextarea = field.type === 'textarea';
                  const shouldSpanFullWidth = field.fullWidth || isTextarea;

                  return (
                    <div
                      key={`${activeRole}-${field.name}`}
                      className={`space-y-1 ${shouldSpanFullWidth ? 'md:col-span-2' : ''}`}
                    >
                      <label className="text-sm font-medium text-slate-600">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="w-full rounded-md border border-slate-300 bg-transparent p-2 text-sm"
                          rows={3}
                          value={formValues[field.name] ?? ''}
                          onChange={(e) =>
                            setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          className="w-full rounded-md border border-slate-300 bg-transparent p-2 text-sm"
                          value={formValues[field.name] ?? field.options?.[0]?.value ?? ''}
                          onChange={(e) =>
                            setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                          }
                        >
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={field.type ?? 'text'}
                          value={formValues[field.name] ?? ''}
                          onChange={(e) =>
                            setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                        />
                      )}
                      {field.helperText && (
                        <p className="text-xs text-slate-500">{field.helperText}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hospital Deletion Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Hospital</DialogTitle>
            <DialogDescription>
              Choose how you would like to delete this hospital.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              How would you like to delete "{hospitalToDelete?.name}"?
            </p>

            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-slate-50">
                <input
                  type="radio"
                  name="deletionMode"
                  value="unlink"
                  checked={deletionMode === 'unlink'}
                  onChange={() => setDeletionMode('unlink')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">Unlink doctors and delete hospital</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Remove hospital-doctor associations and delete only the hospital.
                    Doctors will remain in the system.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer p-3 border border-red-200 rounded-lg hover:bg-red-50">
                <input
                  type="radio"
                  name="deletionMode"
                  value="deleteAll"
                  checked={deletionMode === 'deleteAll'}
                  onChange={() => setDeletionMode('deleteAll')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-red-600">Delete hospital with all doctors</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Permanently delete the hospital AND all associated doctors.
                    This action cannot be undone.
                  </div>
                </div>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={deletionMode === 'deleteAll' ? 'destructive' : 'default'}
              onClick={confirmHospitalDeletion}
            >
              {deletionMode === 'deleteAll' ? 'Delete All' : 'Delete Hospital Only'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


