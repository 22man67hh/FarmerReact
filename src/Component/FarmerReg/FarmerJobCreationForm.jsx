import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Config/api';

const FarmerJobCreationForm = () => {
  const { farmer } = useSelector((state) => state.farmer);
  const navigate = useNavigate();
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Initial form state
  const initialFormState = {
    taskType: '',
    workDate: '',
    duration: '',
    location: '',
    quantity: '',
    wageOffered: '',
    description: '',
    otherTask: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const taskTypes = [
    'Planting',
    'Harvesting',
    'Weeding',
    'Irrigation',
    'Pruning',
    'Fertilizing',
    'Pest Control',
     'Driving',
    'Ploughing',
    'Construction',
    'Other'
  ];

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    
    if (!farmer || !token) {
      navigate("/", { 
        state: { 
          message: "Only registered farmers can access this page",
          redirectTo: "/" 
        } 
      });
      return;
    }
    setIsTokenValid(true);
  }, [farmer, navigate]);

  // Reset form completely
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setShowOtherInput(false);
    setError('');
  }, [initialFormState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'taskType') {
      setShowOtherInput(value === 'Other');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.taskType) {
      setError('Task type is required');
      return false;
    }
    if (formData.taskType === 'Other' && !formData.otherTask) {
      setError('Please specify the task type');
      return false;
    }
    if (!formData.workDate) {
      setError('Work date is required');
      return false;
    }
    if (!formData.duration || formData.duration < 1) {
      setError('Duration must be at least 1 hour');
      return false;
    }
    if (!formData.location) {
      setError('Location is required');
      return false;
    }
    if (!formData.wageOffered || formData.wageOffered < 1) {
      setError('Wage must be at least ₹1');
      return false;
    }
    if (!formData.description) {
      setError('Description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const submissionData = {
        taskType: formData.taskType === 'Other' ? formData.otherTask : formData.taskType,
        workDate: formData.workDate,
        duration: Number(formData.duration),
        location: formData.location,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        wageOffered: Number(formData.wageOffered),
        description: formData.description,
        // farmerId: farmer.id
      };

const response = await axios.post(
  `${API_URL}/api/wages/register/work`,
  submissionData, 
  {
    params: {
      farmerId: farmer?.id
    },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  }
);

      if (response.status === 201) {
        setSuccess(true);
        resetForm();
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (err) {
      console.error("API Error:", {
        error: err,
        response: err.response,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         "Failed to create job request";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Create New Job Request
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
          Job request created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="taskType">
            Task Type *
          </label>
          <select
            id="taskType"
            name="taskType"
            value={formData.taskType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select a task type</option>
            {taskTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {showOtherInput && (
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="otherTask">
              Specify Other Task *
            </label>
            <input
              type="text"
              id="otherTask"
              name="otherTask"
              value={formData.otherTask}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="Enter custom task type"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="workDate">
            Work Date *
          </label>
          <input
            type="date"
            id="workDate"
            name="workDate"
            value={formData.workDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="duration">
            Duration (hours) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            placeholder="e.g., 8"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="location">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            placeholder="Farm address or coordinates"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="quantity">
            Quantity (optional)
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., number of workers needed"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="wageOffered">
            Wage Offered (रु) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">रु</span>
            <input
              type="number"
              id="wageOffered"
              name="wageOffered"
              value={formData.wageOffered}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full pl-8 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="e.g., 500.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            placeholder="Describe the work details, requirements, etc."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
            isSubmitting 
              ? 'bg-green-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Create Job Request'}
        </button>
      </form>
    </div>
  );
};

export default FarmerJobCreationForm;