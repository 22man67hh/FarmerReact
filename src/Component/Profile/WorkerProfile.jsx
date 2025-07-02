import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiUser, FiPhone, FiMapPin, FiDollarSign, FiAward, FiTool } from 'react-icons/fi';

const WorkerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedProfile = location.state;

  const [profile, setProfile] = useState(passedProfile || null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(passedProfile || {});
  const [isLoading, setIsLoading] = useState(false); // Remove if not using fetch
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setProfile(formData);
    setIsEditing(false);
    setSuccess('Profile updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

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

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No profile found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-400 to-green-500">
            <div className="absolute -bottom-16 left-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white"
              >
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </motion.div>
            </div>

            <div className="absolute bottom-4 right-6">
              {isEditing ? (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdate}
                    className="p-2 bg-green-500 text-white rounded-full shadow-md"
                  >
                    <FiSave className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-md"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-blue-500 text-white rounded-full shadow-md"
                >
                  <FiEdit2 className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </div>

          <div className="pt-20 px-6 pb-6">
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800"
            >
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-b-2 border-blue-500 focus:outline-none"
                />
              ) : (
                profile.name
              )}
            </motion.h1>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-blue-500" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiPhone className="text-gray-500 mr-3" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700">{profile.contact}</p>
                )}
              </div>

              <div className="flex items-center">
                <FiMapPin className="text-gray-500 mr-3" />
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700">{profile.location}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Work Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiTool className="mr-2 text-green-500" />
              Work Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiDollarSign className="text-gray-500 mr-3" />
                {isEditing ? (
                  <div className="flex items-center w-full">
                    <span className="mr-2">रु</span>
                    <input
                      type="number"
                      name="rateperday"
                      value={formData.rateperday}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-gray-700">रु {profile.rateperday} per day</p>
                )}
              </div>

              <div className="flex items-center">
                <FiAward className="text-gray-500 mr-3" />
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700">{profile.experience} years experience</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-xl p-6 md:col-span-2"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiTool className="mr-2 text-purple-500" />
              Skills
            </h2>

            {isEditing ? (
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                rows="3"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills?.split(',').map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-lg"
          >
            {success}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WorkerProfile;
