import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import { LocationOn, Person, Work, Phone, Star, Edit, Delete, Search } from '@mui/icons-material';

const mockWageWorkers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    contact: '9876543210',
    Skills: 'Plowing, Harvesting',
    rateperday: 800,
    available: true,
    points: 4,
    location: { latitude: 19.0760, longitude: 72.8777, address: 'Mumbai, Maharashtra' },
    experience: '5 years',
    farmer: { name: 'Farm Owner 1' }
  },
  {
    id: 2,
    name: 'Suresh Patel',
    contact: '8765432109',
    Skills: 'Planting, Irrigation',
    rateperday: 700,
    available: false,
    points: 3,
    location: { latitude: 18.5204, longitude: 73.8567, address: 'Pune, Maharashtra' },
    experience: '3 years',
    farmer: { name: 'Farm Owner 2' }
  },
  {
    id: 3,
    name: 'Manoj Singh',
    contact: '7654321098',
    Skills: 'Pruning, Fertilizing',
    rateperday: 900,
    available: true,
    points: 5,
    location: { latitude: 17.3850, longitude: 78.4867, address: 'Hyderabad, Telangana' },
    experience: '7 years',
    farmer: { name: 'Farm Owner 3' }
  },
];

const skillsOptions = [
  'Plowing',
  'Harvesting',
  'Planting',
  'Irrigation',
  'Pruning',
  'Fertilizing',
  'Weeding',
  'Spraying',
  'Transplanting',
  'Tractor Operation'
];

const Wages = () => {
  const [wageWorkers, setWageWorkers] = useState(mockWageWorkers);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const formik = useFormik({
    initialValues: {
      name: '',
      contact: '',
      Skills: [],
      rateperday: '',
      available: true,
      points: 0,
      location: {
        latitude: '',
        longitude: '',
        address: ''
      },
      experience: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      contact: Yup.string()
        .required('Contact is required')
        .matches(/^[0-9]{10}$/, 'Contact must be 10 digits'),
      Skills: Yup.array().min(1, 'At least one skill is required'),
      rateperday: Yup.number()
        .required('Rate per day is required')
        .min(100, 'Rate must be at least 100'),
      points: Yup.number()
        .min(0, 'Points cannot be negative')
        .max(5, 'Points cannot be more than 5'),
      experience: Yup.string().required('Experience is required'),
      location: Yup.object().shape({
        address: Yup.string().required('Address is required')
      })
    }),
    onSubmit: (values, { resetForm }) => {
      const newWorker = {
        id: wageWorkers.length + 1,
        ...values,
        location: {
          ...values.location,
          latitude: values.location.latitude || 0,
          longitude: values.location.longitude || 0
        },
        farmer: { name: 'Current User' } 
      };

      if (currentWorker) {
        // Update existing worker
        setWageWorkers(wageWorkers.map(w => w.id === currentWorker.id ? newWorker : w));
        setSnackbar({ open: true, message: 'Worker updated successfully', severity: 'success' });
      } else {
        // Add new worker
        setWageWorkers([...wageWorkers, newWorker]);
        setSnackbar({ open: true, message: 'Worker added successfully', severity: 'success' });
      }

      resetForm();
      setCurrentWorker(null);
      setOpenDialog(false);
    }
  });

  // Handle edit
  const handleEdit = (worker) => {
    setCurrentWorker(worker);
    formik.setValues(worker);
    setOpenDialog(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setWageWorkers(wageWorkers.filter(worker => worker.id !== id));
    setSnackbar({ open: true, message: 'Worker deleted successfully', severity: 'success' });
  };

  // Filter workers based on search and availability
  const filteredWorkers = wageWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         worker.Skills.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = availabilityFilter === 'all' || 
                              (availabilityFilter === 'available' && worker.available) || 
                              (availabilityFilter === 'unavailable' && !worker.available);
    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper elevation={3} className="p-6 mb-8">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Worker List" icon={<Work />} />
          <Tab label="Add New Worker" icon={<Person />} />
        </Tabs>

        {activeTab === 0 ? (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or skills..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto">
                <FormControl variant="outlined" size="small" className="w-full">
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    label="Availability"
                    className="min-w-[150px]"
                  >
                    <MenuItem value="all">All Workers</MenuItem>
                    <MenuItem value="available">Available Only</MenuItem>
                    <MenuItem value="unavailable">Unavailable Only</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <TableContainer>
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell>Worker</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Rate/Day</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWorkers.length > 0 ? (
                    filteredWorkers.map((worker) => (
                      <TableRow key={worker.id} hover>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-3 bg-blue-500">
                              {worker.name.charAt(0)}
                            </Avatar>
                            <div>
                              <div className="font-medium">{worker.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="mr-1" fontSize="small" />
                                {worker.contact}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {worker.Skills.split(', ').map((skill, index) => (
                              <Chip key={index} label={skill} size="small" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>₹{worker.rateperday}</TableCell>
                        <TableCell>{worker.experience}</TableCell>
                        <TableCell>
                          <Chip
                            label={worker.available ? 'Available' : 'Unavailable'}
                            color={worker.available ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="text-yellow-500 mr-1" />
                            {worker.points}/5
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-blue-500 cursor-pointer">
                            <LocationOn className="mr-1" />
                            <span className="truncate max-w-[120px]">{worker.location.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={<Edit />}
                              onClick={() => handleEdit(worker)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleDelete(worker.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No workers found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className="mt-6">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                formik.resetForm();
                setCurrentWorker(null);
                setOpenDialog(true);
              }}
            >
              Add New Worker
            </Button>
          </div>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentWorker ? 'Edit Worker' : 'Add New Worker'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
                variant="outlined"
                margin="normal"
              />
              <FormControl fullWidth margin="normal" error={formik.touched.Skills && Boolean(formik.errors.Skills)}>
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  name="Skills"
                  value={formik.values.Skills}
                  onChange={formik.handleChange}
                  renderValue={(selected) => (
                    <div className="flex flex-wrap gap-1">
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </div>
                  )}
                >
                  {skillsOptions.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.Skills && formik.errors.Skills && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.Skills}</div>
                )}
              </FormControl>
              <TextField
                fullWidth
                label="Rate Per Day (₹)"
                name="rateperday"
                type="number"
                value={formik.values.rateperday}
                onChange={formik.handleChange}
                error={formik.touched.rateperday && Boolean(formik.errors.rateperday)}
                helperText={formik.touched.rateperday && formik.errors.rateperday}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                error={formik.touched.experience && Boolean(formik.errors.experience)}
                helperText={formik.touched.experience && formik.errors.experience}
                variant="outlined"
                margin="normal"
              />
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Switch
                      name="available"
                      checked={formik.values.available}
                      onChange={formik.handleChange}
                      color="primary"
                    />
                  }
                  label="Available for work"
                />
              </div>
              <TextField
                fullWidth
                label="Rating (0-5)"
                name="points"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.5 }}
                value={formik.values.points}
                onChange={formik.handleChange}
                error={formik.touched.points && Boolean(formik.errors.points)}
                helperText={formik.touched.points && formik.errors.points}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                name="location.address"
                value={formik.values.location.address}
                onChange={formik.handleChange}
                error={formik.touched.location?.address && Boolean(formik.errors.location?.address)}
                helperText={formik.touched.location?.address && formik.errors.location?.address}
                variant="outlined"
                margin="normal"
                multiline
                rows={2}
              />
              <div className="grid grid-cols-2 gap-4">
                               <TextField
                  fullWidth
                  label="Longitude"
                  name="location.longitude"
                  type="number"
                  value={formik.values.location.longitude}
                  onChange={formik.handleChange}
                  variant="outlined"
                  margin="normal"
                />
              </div>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="text-lg font-medium mb-2">Location Preview</div>
              <div className="h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                {formik.values.location.address ? (
                  <div className="text-center">
                    <LocationOn className="text-red-500 text-4xl" />
                    <p className="mt-2">{formik.values.location.address}</p>
                    {formik.values.location.latitude && formik.values.location.longitude && (
                      <p className="text-sm text-gray-500">
                        Coordinates: {formik.values.location.latitude}, {formik.values.location.longitude}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Enter address to see preview</p>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {currentWorker ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Wages;