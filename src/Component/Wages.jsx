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
  Avatar,
  TablePagination
} from '@mui/material';
import { LocationOn, Person, Work, Phone, Star, Edit, Delete, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWages } from './State/Wages/Wages';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './Config/api';

const Wages = () => {
  // State management
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Redux state
  const { works } = useSelector((state) => state.wage);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!jwt) {
        navigate("/", { state: { message: "Token not valid, please login again" } });
        return;
      }
      try {
        setLoading(true);
        await dispatch(getAllWages());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, jwt, navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = async (worker) => {
    try {
if(!jwt){
        navigate("/", { state: { message: "Token not valid, please login again" } });
}      const res = await axios.post(
    `${API_URL}/api/dailywages/book/work`,
      {  
        params: {  
          workRequestId: worker?.id,
          workerId: user?.id
        },
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
        

      );
    
      
      setSnackbar({
        open: true,
        message: 'Successfully applied for work',
        severity: 'success'
      });

    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to apply for work',
        severity: 'error'
      });
    }
  };

  const filteredWorkers = works?.filter(worker => {
    if (!worker) return false;
    
    const matchesSearch = 
      (worker.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       worker.taskType?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && worker.status === 'ACTIVE') || 
      (availabilityFilter === 'unavailable' && worker.status !== 'ACTIVE');
    
    return matchesSearch && matchesAvailability;
  }) || [];

  // Paginated workers
  const paginatedWorkers = filteredWorkers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper elevation={3} className="p-6 mb-8">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Works List" icon={<Work />} />
        </Tabs>

        {activeTab === 0 && (
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0); // Reset to first page when searching
                  }}
                />
              </div>
              <div className="w-full md:w-auto">
                <FormControl variant="outlined" size="small" className="w-full">
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availabilityFilter}
                    onChange={(e) => {
                      setAvailabilityFilter(e.target.value);
                      setPage(0); // Reset to first page when changing filter
                    }}
                    label="Availability"
                    className="min-w-[150px]"
                  >
                    <MenuItem value="all">All Works</MenuItem>
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
                    <TableCell>Work</TableCell>
                    <TableCell>Skill Need</TableCell>
                    <TableCell>Rate/Day</TableCell>
                    <TableCell>Work Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>No of Demand</TableCell>
                    <TableCell>Work Duration</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedWorkers.length > 0 ? (
                    paginatedWorkers.map((worker) => (
                      <TableRow key={worker.id} hover>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-3 bg-blue-500">
                              {worker.taskType?.charAt(0)}
                            </Avatar>
                            <div>
                              <div className="font-medium">{worker.taskType}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="mr-1" fontSize="small" />
                                {worker.farmer?.displayname}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {worker.taskType?.split(',')?.map((skill, index) => (
                              <Chip key={index} label={skill.trim()} size="small" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>NPR {worker.wageOffered}</TableCell>
                        <TableCell>{new Date(worker.workDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={worker.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                            color={worker.status === 'ACTIVE' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {worker.description}
                        </TableCell>
                        <TableCell>
                          {worker.quantity}
                        </TableCell>
                        <TableCell>
                          {worker.duration} hours
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-blue-500 cursor-pointer">
                            <LocationOn className="mr-1" />
                            <span className="truncate max-w-[120px]">{worker?.location}</span>
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
                              disabled={worker.status !== 'ACTIVE'}
                            >
                              Apply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        No work found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredWorkers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="border-t"
            />
          </div>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Wages;