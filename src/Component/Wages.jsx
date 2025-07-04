import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
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
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  Chip,
  Avatar,
  TablePagination,
  CircularProgress
} from '@mui/material';
import { LocationOn, Work, Phone, Edit, Search, SettingsApplicationsOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWages, getRecommend, getWagesProfile } from './State/Wages/Wages';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './Config/api';

const Wages = () => {
  // State management
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const { works, worker } = useSelector((state) => state.wage);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(getWagesProfile(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!jwt) {
        navigate("/", { state: { message: "Token not valid, please login again" } });
        return;
      }
      try {
        setLoading(true);
        if (worker && worker.length > 0) {
        await dispatch(getRecommend());
      } else {
        await dispatch(getAllWages());
      }
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

  const handleApply = async (work) => {
    try {
      setApplying(true);
      
      if (!worker?.id) {
        navigate("/profile", {
          state: { message: "You need to create a worker profile before applying" }
        });
        return;
      }

      if (!jwt) {
        navigate("/", { 
          state: { message: "Token not valid, please login again" } 
        });
        return;
      }

   const response = await axios.post(
  `${API_URL}/api/dailywages/workss`,
  null,  
  {
    params: {  
      workRequestId: work.id,
      workerId: worker?.id
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
      console.error('Application error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 
               error.message || 
               'Failed to apply for work',
        severity: 'error'
      });
    } finally {
      setApplying(false);
    }
  };

  const filteredWorkers = works?.filter(work => {
    if (!work) return false;
    
    const matchesSearch = 
      (work.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       work.taskType?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && work.status === 'ACTIVE') || 
      (availabilityFilter === 'unavailable' && work.status !== 'ACTIVE');
    
    return matchesSearch && matchesAvailability;
  }) || [];

  const paginatedWorkers = filteredWorkers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper elevation={3} className="p-6 mb-8">
        <div className='flex flex-row-reverse'><span className='bg-green-600 px-4 py-2 rounded-2xl text-white font-bold ring hover:bg-green-200 hover:cursor-pointer hover:text-white'><Link to="/workerApplication">Your Application</Link> </span></div>
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
                    setPage(0);
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
                      setPage(0);
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
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : paginatedWorkers.length > 0 ? (
                    paginatedWorkers.map((work) => (
                      <TableRow key={work.id} hover>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-3 bg-blue-500">
                              {work.taskType?.charAt(0)}
                            </Avatar>
                            <div>
                              <div className="font-medium">{work.taskType}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="mr-1" fontSize="small" />
                                {work.farmer?.displayname || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {work.taskType?.split(',').map((skill, index) => (
                              <Chip 
                                key={index} 
                                label={skill.trim()} 
                                size="small" 
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>NPR {work.wageOffered || '0'}</TableCell>
                        <TableCell>
                          {work.workDate ? new Date(work.workDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={work.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                            color={work.status === 'ACTIVE' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {work.description || 'No description'}
                        </TableCell>
                        <TableCell>{work.quantity || '0'}</TableCell>
                        <TableCell>{work.duration || '0'} hours</TableCell>
                        <TableCell>
                         <div className="flex items-center text-blue-500">
  <LocationOn className="mr-1" />
  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(work.location)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="truncate max-w-[120px] hover:underline"
  >
    {work.location || 'Location not specified'}
  </a>
</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => handleApply(work)}
                            disabled={work.status !== 'ACTIVE' || applying}
                          >
                            {applying ? 'Applying...' : 'Apply'}
                          </Button>
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
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
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