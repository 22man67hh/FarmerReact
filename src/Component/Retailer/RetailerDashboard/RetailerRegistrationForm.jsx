import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LeafletMap from '../../Booking/LeafletMap';
import { getRetailer, registerRetailer } from '../../State/Retailer/RetailerSlice';
import { uploadImagetoCloud } from '@/Component/Home/Util/UploadTocloud';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  TextField, 
  Checkbox 
} from '@mui/material';

const RetailerRegistrationForm = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const {retailer}=useSelector((state)=>state.retailer)
  const dispatch = useDispatch();
  const navigate = useNavigate();
const {user} =useSelector((state)=>state.auth)
const location=useLocation();
const {state}=location;
const editMode=state?.editMode || false;
const retailerData=state?.existingData;
  const initialValues = {
    ownerName: editMode ? retailerData?.ownerName : user?.fullName || '',
    ownerEmail: editMode ? retailerData?.ownerEmail : user?.email || '',
    shopName: editMode ? retailerData?.shopName : '',
    panNumber: editMode ? retailerData?.panNumber : '',
    phone: editMode ? retailerData?.phone : '',
    panImage: editMode ? retailerData?.panImageUrl : null,
    description: editMode ? retailerData?.description : '',
    location: editMode ? retailerData?.location : {
      latitude: 27.7172,
      longitude: 85.3240,
      address: ''
    },
    startTime: editMode ? retailerData?.startTime : '',
    endTime: editMode ? retailerData?.endTime : '',
    active: editMode ? retailerData?.active : false
  };
const userId=user?.id;

  useEffect(()=>{
if(userId){
  dispatch(getRetailer({userId:userId}))
}
  },[dispatch,userId])

// useEffect(()=>{
//   if(retailer){
//     navigate("/retailer/application-status")
//   }
// },[retailer,navigate])
  const validationSchema = Yup.object().shape({
    ownerName: Yup.string().required('Owner name is required'),
    ownerEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    shopName: Yup.string().required('Shop name is required'),
    // panNumber: Yup.string()
    //   .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)')
    //   .required('PAN number is required'),
    phone: Yup.string(),
    // panImage: Yup.mixed().required('PAN image is required'),
    // location: Yup.object().shape({
    //   address: Yup.string().required('Location is required')
    // }),
    startTime: Yup.string(),
    endTime: Yup.string()
  });

  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
  try {
    setStatus('loading');
    setError(null);

     let panImageUrl = values.panImage;
    if (values.panImage && typeof values.panImage !== 'string') {
      panImageUrl = await uploadImagetoCloud(values.panImage);
    }

    const registrationData = {
   ...values,
   panImageUrl:panImageUrl,
   location:values.location ||{
     latitude: 27.7172,
        longitude: 85.3240,
        address: ''
   }
    };
const isEdit=Boolean(editMode && retailerData?.id);
    await dispatch(registerRetailer({ 
      registrationData,
userId: isEdit ? undefined :user?.id ,
requestId:isEdit ? retailerData.id :undefined,
isEdit   }));
    
    setStatus('success');
    navigate('/retailer');
  } catch (err) {
    setError(err.payload ||
      
   (editMode? 'Update failed >please Try again.' :'Registration failed. Please try again.'));
    setStatus('error');
  } finally {
    setSubmitting(false);
  }
};
  const handleImageChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // try {
    //   const panImage = await uploadImagetoCloud(file);
    //   setFieldValue("panImage", panImage);
    // } catch (error) {
    //   console.error('Error uploading image:', error);
    //   setError('Failed to upload PAN image');
    // }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <Typography variant="h4" component="h1" gutterBottom>
          Retailer Registration
        </Typography>
        
        {status === 'success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Registration successful! You'll be notified once your application is reviewed.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values, touched, errors }) => {
            
            useEffect(() => {
              const updateLocation = async () => {
                if (selectedPosition) {
                  const address = await fetchAddressFromCoordinates(
                    selectedPosition.lat, 
                    selectedPosition.lng
                  );
                  setFieldValue('location', {
                    latitude: selectedPosition.lat,
                    longitude: selectedPosition.lng,
                    address: address
                  });
                }
              };
              updateLocation();
            }, [selectedPosition, setFieldValue]);

            return (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Owner Name <span className="text-red-500">*</span>
                      </Typography>
                      <Field
                        as={TextField}
                        name="ownerName"
                        fullWidth
                        variant="outlined"
                        disabled
                        error={touched.ownerName && Boolean(errors.ownerName)}
                        helperText={touched.ownerName && errors.ownerName}
                      />
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Owner Email <span className="text-red-500">*</span>
                      </Typography>
                      <Field
                        as={TextField}
                        name="ownerEmail"
                        type="email"
                        fullWidth
                        variant="outlined"
                        disabled
                        error={touched.ownerEmail && Boolean(errors.ownerEmail)}
                        helperText={touched.ownerEmail && errors.ownerEmail}
                      />
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Shop Name <span className="text-red-500">*</span>
                      </Typography>
                      <Field
                        as={TextField}
                        name="shopName"
                        fullWidth
                        variant="outlined"
                        error={touched.shopName && Boolean(errors.shopName)}
                        helperText={touched.shopName && errors.shopName}
                      />
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        PAN Number <span className="text-red-500">*</span>
                      </Typography>
                      <Field
                        as={TextField}
                        name="panNumber"
                        fullWidth
                        variant="outlined"
                        error={touched.panNumber && Boolean(errors.panNumber)}
                        helperText={touched.panNumber && errors.panNumber}
                      />
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Phone Number
                      </Typography>
                      <Field
                        as={TextField}
                        name="phone"
                        type="tel"
                        fullWidth
                        variant="outlined"
                      />
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        PAN Image <span className="text-red-500">*</span>
                      </Typography>
                      <input
                        type="file"
                        name="panImage"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                        accept="image/*"
                        className={`w-full px-3 py-2 border rounded-md ${
                          touched.panImage && errors.panImage ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.panImage && touched.panImage && (
                        <Typography color="error" variant="caption">
                          {errors.panImage}
                        </Typography>
                      )}
                      {values.panImage && typeof values.panImage === 'string' && (
                        <Box mt={2}>
                          <img
                            src={values.panImage}
                            alt="PAN Preview"
                            style={{ maxWidth: '100%', maxHeight: 200 }}
                          />
                        </Box>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Shop Description
                      </Typography>
                      <Field
                        as={TextField}
                        name="description"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                      />
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Business Hours
                      </Typography>
                      <Box display="flex" gap={2}>
                        <Field
                          as={TextField}
                          name="startTime"
                          label="Opening Time"
                          type="time"
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                        <Field
                          as={TextField}
                          name="endTime"
                          label="Closing Time"
                          type="time"
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Box>
                    </div>

                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Shop Location <span className="text-red-500">*</span>
                      </Typography>
                      <Box height={300} mb={2}>
                        <LeafletMap 
                          selectedPosition={selectedPosition}
                          setSelectedPosition={setSelectedPosition}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          <strong>Selected Location:</strong>
                        </Typography>
                        <Typography variant="body2">
                          Latitude: {values.location.latitude.toFixed(6)}
                        </Typography>
                        <Typography variant="body2">
                          Longitude: {values.location.longitude.toFixed(6)}
                        </Typography>
                        {values.location.address && (
                          <Box mt={1} p={1} bgcolor="grey.100" borderRadius={1}>
                            <Typography variant="body2">
                              <strong>Address:</strong> {values.location.address}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {errors.location && touched.location && (
                        <Typography color="error" variant="caption">
                          {errors.location}
                        </Typography>
                      )}
                    </div>

                  
                  </div>
                </div>

                <Box display="flex" justifyContent="center" mt={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default RetailerRegistrationForm;