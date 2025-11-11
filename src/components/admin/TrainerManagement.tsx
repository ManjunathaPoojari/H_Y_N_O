import { useState } from 'react';
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
  TableRow
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import {
  CheckCircle, XCircle, Eye, Search, User, Star,
  MapPin, Phone, Mail, Award, Calendar, Dumbbell
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { Trainer } from '../../types';

export const TrainerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const { trainers, approveTrainer, rejectTrainer } = useAppStore();

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || trainer.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: trainers.length,
    approved: trainers.filter(t => t.status === 'approved').length,
    pending: trainers.filter(t => t.status === 'pending').length,
    rejected: trainers.filter(t => t.status === 'rejected').length,
  };

  const handleApprove = (trainerId: string) => {
    approveTrainer(trainerId);
  };

  const handleReject = (trainerId: string) => {
    rejectTrainer(trainerId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Trainer Management</h1>
        <p className="text-gray-600">Approve and manage yoga and fitness trainer registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer" onClick={() => setFilter('all')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Trainers</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setFilter('approved')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1 text-green-600">{stats.approved}</div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setFilter('pending')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1 text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setFilter('rejected')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1 text-red-600">{stats.rejected}</div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trainers by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'approved', 'pending', 'rejected'] as const).map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trainers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trainers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainers.map(trainer => (
                <TableRow key={trainer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{trainer.profileImage || '🧘‍♀️'}</div>
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-gray-600">{trainer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialties.slice(0, 2).map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {trainer.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{trainer.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{trainer.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{trainer.experience} years</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm">{trainer.rating}</span>
                      <span className="text-xs text-gray-600">({trainer.reviews})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      trainer.status === 'approved' ? 'bg-green-500' :
                      trainer.status === 'pending' ? 'bg-yellow-500' :
                      trainer.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                    }>
                      {trainer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTrainer(trainer)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Trainer Details</DialogTitle>
                          </DialogHeader>
                          {selectedTrainer && (
                            <div className="space-y-6">
                              {/* Profile Header */}
                              <div className="flex items-start gap-4">
                                <div className="text-6xl">{selectedTrainer.profileImage || '🧘‍♀️'}</div>
                                <div className="flex-1">
                                  <h3 className="text-xl mb-1">{selectedTrainer.name}</h3>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="font-medium">{selectedTrainer.rating}</span>
                                    <span className="text-sm text-gray-600">({selectedTrainer.reviews} reviews)</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Award className="h-3 w-3" />
                                      {selectedTrainer.experience} years
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {selectedTrainer.location}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{selectedTrainer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{selectedTrainer.phone}</span>
                                </div>
                              </div>

                              {/* Bio */}
                              <div>
                                <h4 className="font-semibold mb-2">Bio</h4>
                                <p className="text-sm text-gray-600">{selectedTrainer.bio}</p>
                              </div>

                              {/* Specialties */}
                              <div>
                                <h4 className="font-semibold mb-2">Specialties</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTrainer.specialties.map(specialty => (
                                    <Badge key={specialty} variant="secondary">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Qualifications */}
                              <div>
                                <h4 className="font-semibold mb-2">Qualifications</h4>
                                <ul className="space-y-1">
                                  {selectedTrainer.qualifications.map((qual, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                                      {qual}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Languages */}
                              <div>
                                <h4 className="font-semibold mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTrainer.languages.map(language => (
                                    <Badge key={language} variant="outline">
                                      {language}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Pricing */}
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-semibold">Price per Session</span>
                                <span className="text-xl font-bold text-green-600">₹{selectedTrainer.pricePerSession}</span>
                              </div>

                              {/* Registration Date */}
                              {selectedTrainer.createdAt && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Registered on {new Date(selectedTrainer.createdAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {trainer.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(trainer.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(trainer.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTrainers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No trainers found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
