import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../Config/api';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud';
import { useSelector } from 'react-redux';

const CreateWorkerProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const animatedComponents = makeAnimated();
  const navigate = useNavigate();

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

  const skillOptions = taskTypes.map(type => ({
    value: type,
    label: type
  }));

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    rateperday: '',
    experience: '',
    address: '',
    skills: '',
    profileImage: '' 
  });
  
  const [previewImage, setPreviewImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
    setFormData(prev => ({
      ...prev,
      skills: selectedOptions.map(option => option.value).join(', ')
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setPreviewImage(URL.createObjectURL(file));
        const cloudinaryUrl = await uploadImagetoCloud(file);
        setFormData(prev => ({
          ...prev,
          profileImage: cloudinaryUrl
        }));
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem("jwt");
      
      const payload = {
        ...formData
      };

      const response = await axios.post(
        `${API_URL}/api/wages/register`,
        payload,
        {
          
            params:{
userId:user?.id
            }
          ,
          headers: {
            'Authorization': `Bearer ${token}`,
            
          }
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header with illustration */}
        <div className="relative h-48 bg-gradient-to-r from-green-400 to-blue-500 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -right-20 -top-20"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3058/3058971.png" 
              alt="Worker illustration"
              className="h-64 opacity-20"
            />
          </motion.div>
          <div className="relative z-10 p-6 text-white">
            <motion.h2 
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-3xl font-bold"
            >
              Create Your Work Profile
            </motion.h2>
            <p className="mt-2">Stand out and get hired faster!</p>
          </div>
        </div>

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >
          {/* Error/Success Messages */}
          {error && (
            <motion.div variants={itemVariants} className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-3 bg-green-100 text-green-700 rounded-lg"
            >
              Profile created successfully! Redirecting...
            </motion.div>
          )}

          {/* Profile Picture Upload */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-full w-full object-cover"/>
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">Add a professional photo</p>
          </motion.div>

          {/* Form Fields */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (रु) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">रु</span>
                <input
                  type="number"
                  name="rateperday"
                  value={formData.rateperday}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
              <Select
                isMulti
                name="skills"
                options={skillOptions}
                value={selectedSkills}
                onChange={handleSkillChange}
                components={animatedComponents}
                closeMenuOnSelect={false}
                placeholder="Select your skills..."
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '44px',
                    borderColor: '#d1d5db',
                    '&:hover': { borderColor: '#3b82f6' },
                    boxShadow: 'none'
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#e5e7eb',
                    borderRadius: '0.375rem'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#1f2937',
                    fontWeight: '500'
                  })
                }}
                required
              />
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="pt-4"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                isSubmitting 
                  ? 'bg-blue-400' 
                  : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Profile...
                </span>
              ) : 'Complete Profile'}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed bottom-10 left-10 opacity-20"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/6869/6869752.png" alt="Decoration" className="h-24" />
      </motion.div>
    </div>
  );
};

export default CreateWorkerProfile;