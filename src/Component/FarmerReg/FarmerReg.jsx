import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  Modal,
  Checkbox
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createFarmer } from '../State/Farmer/FarmerSlie';
import { toast } from 'react-toastify';
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud';
import LeafletMap from './LeafletMap';

const FarmerReg = () => {
  const { email, name, jwt } = useSelector((state) => state.auth);
  const { error, farmer, success } = useSelector((state) => state.farmer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const productOptions = [
    "Dairy_Product",
    "Field_Product",
    "Animal_waste",
    "Animal_Product",
    "Other_Product"
  ];

  const initialValues = {
    name: name || "",
    displayname: "",
    citizenno: "",
    houseno: "",
    phone:farmer?.phone|| "",
    facebook: "",
    email: email || "",
    productType: [],
    images: [],
    displayImages: [],
    location: {
      latitude:'',
      longitude:'',
      address:''
    },
    coordinates: null
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    displayname: Yup.string().required("Farm name is required"),
    citizenno: Yup.string().required("Citizenship No is required"),
    houseno: Yup.string().required("House no is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone no is required"),
    facebook: Yup.string()
      .url("Must be a valid URL (e.g., https://facebook.com/username)")
      .required("Facebook URL is required"),
    productType: Yup.array()
      .min(1, "At least one product type must be selected"),
    images: Yup.array()
      .min(1, "At least one image is required"),
    displayImages: Yup.array()
      .min(1, "At least one display image is required"),
  location: Yup.object().shape({
    address: Yup.string().required("Address is required"),
    latitude: Yup.number().required(),
    longitude: Yup.number().required()
  })  });

  const handleImageChange = async (e, values, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = await uploadImagetoCloud(file);
    setFieldValue("images", [...values.images, imageUrl]);
  };

  const handleRemoveImage = (index, values, setFieldValue) => {
    const updated = [...values.images];
    updated.splice(index, 1);
    setFieldValue("images", updated);
  };

  const handleDisplayImage = async (e, values, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = await uploadImagetoCloud(file);
    setFieldValue("displayImages", [...values.displayImages, imageUrl]);
  };

  const handleRemoveDisplayImage = (index, values, setFieldValue) => {
    const updated = [...values.displayImages];
    updated.splice(index, 1);
    setFieldValue("displayImages", updated);
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      navigate("/");
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {error && (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', mb: 2 }}>
          {error}
        </Typography>
      )}
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Register Farmer
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(createFarmer({ jwt, data: values }));
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, touched, errors, isSubmitting }) => {
          const handleMapSelect = (coords) => {
            setSelectedCoords(coords);
            setFieldValue("coordinates", coords);
            
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`)
              .then(res => res.json())
              .then(data => {
              setFieldValue("location", {
        latitude: coords.lat,
        longitude: coords.lng,
        address: data?.display_name || ""
      });
              });
          };

          return (
            <>
              <Form>
                {/* Images Upload */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Farm Images</Typography>
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{ mr: 2 }}
                    >
                      Add Farm Images
                    </Button>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, values, setFieldValue)}
                    hidden
                  />
                  {errors.images && touched.images && (
                    <Typography color="error" variant="caption" display="block">
                      {errors.images}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    {values.images.map((img, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={img}
                          alt={`farm-${index}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveImage(index, values, setFieldValue)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: 30,
                            height: 30
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Display Image</Typography>
                  <label htmlFor="display-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{ mr: 2 }}
                    >
                      Add Display Image
                    </Button>
                  </label>
                  <input
                    id="display-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDisplayImage(e, values, setFieldValue)}
                    hidden
                  />
                  {errors.displayImages && touched.displayImages && (
                    <Typography color="error" variant="caption" display="block">
                      {errors.displayImages}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    {values.displayImages.map((img, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={img}
                          alt={`display-${index}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveDisplayImage(index, values, setFieldValue)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: 30,
                            height: 30
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Field
                  as={TextField}
                  name="displayname"
                  label="Farm Name (Must be unique)"
                  fullWidth
                  margin="normal"
                  error={touched.displayname && Boolean(errors.displayname)}
                  helperText={touched.displayname && errors.displayname}
                />

                <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
                <Field
                  as={TextField}
                  name="name"
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  disabled
                />
                <Field
                  as={TextField}
                  name="citizenno"
                  label="Citizenship No"
                  fullWidth
                  margin="normal"
                  error={touched.citizenno && Boolean(errors.citizenno)}
                  helperText={touched.citizenno && errors.citizenno}
                />
                <Field
                  as={TextField}
                  name="houseno"
                  label="House No"
                  fullWidth
                  margin="normal"
                  error={touched.houseno && Boolean(errors.houseno)}
                  helperText={touched.houseno && errors.houseno}
                />
                <Field
                  as={TextField}
                  name="phone"
                  label="Phone No"
                  fullWidth
                  margin="normal"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
                <Field
                  as={TextField}
                  name="facebook"
                  label="Facebook URL"
                  fullWidth
                  margin="normal"
                  error={touched.facebook && Boolean(errors.facebook)}
                  helperText={touched.facebook && errors.facebook}
                />

                {/* Location Picker */}
             <Box sx={{ mt: 2, mb: 2 }}>
  <Typography variant="h6" sx={{ mb: 1 }}>Farm Location</Typography>
  
  <Button 
    variant="outlined" 
    onClick={() => setMapOpen(true)}
    sx={{ mb: 2 }}
  >
    Pick Location on Map
  </Button>

  {values.location.latitude && (
    <Typography variant="body2" sx={{ mb: 1 }}>
      Selected Coordinates: {values.location.latitude.toFixed(5)}, {values.location.longitude.toFixed(5)}
    </Typography>
  )}

  <Field
    as={TextField}
    name="location.address"
    label="Address"
    fullWidth
    margin="normal"
    value={values.location.address || ''}
    error={touched.location?.address && Boolean(errors.location?.address)}
    helperText={touched.location?.address && errors.location?.address}
  />
  
  {/* Hidden fields for coordinates */}
  <Field type="hidden" name="location.latitude" />
  <Field type="hidden" name="location.longitude" />
</Box>

                {/* Product Types */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Product Types</Typography>
                  <FormControl component="fieldset" fullWidth>
                    <FormGroup>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {productOptions.map((option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                checked={values.productType.includes(option)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setFieldValue(
                                    "productType",
                                    checked
                                      ? [...values.productType, option]
                                      : values.productType.filter((p) => p !== option)
                                  );
                                }}
                              />
                            }
                            label={option.replace(/_/g, ' ')}
                          />
                        ))}
                      </Box>
                    </FormGroup>
                    {errors.productType && touched.productType && (
                      <Typography color="error" variant="caption">
                        {errors.productType}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 3, py: 2 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register Farmer"
                  )}
                </Button>
              </Form>

              <Modal open={mapOpen} onClose={() => setMapOpen(false)}>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '80%',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Select Location</Typography>
                  <LeafletMap 
                    selectedPosition={selectedCoords}
                    onPositionSelected={handleMapSelect}
                  />
                  <Button 
                    onClick={() => setMapOpen(false)}
                    sx={{ mt: 2 }}
                    variant="contained"
                  >
                    Confirm Location
                  </Button>
                </Box>
              </Modal>
            </>
          );
        }}
      </Formik>
    </Box>
  );
};

export default FarmerReg;