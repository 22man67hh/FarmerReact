import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { Checkbox } from '@mui/material';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createFarmer } from '../State/Farmer/FarmerSlie';
import { toast } from 'react-toastify';
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud';

const FarmerReg = () => {
  const { email, name, jwt } = useSelector((state) => state.auth);
  const { error, farmer, success } = useSelector((state) => state.farmer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productOptions = [
    "Dairy_Product",
    "Field_Product",
    "Animal_waste",
    "Animal_Product",
    "Other_Product"
  ];

  const initialValues = {
    name: name || "",
    displayname:"",
    citizenno: "",
    houseno: "",
    phone: "",
    facebook: "",
    email: email || "",
    productType: [],
    images: [],
    displayImages: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
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
      .min(1, "At least one display image is required")
  });

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
        {({ values, setFieldValue, touched, errors, isSubmitting }) => (
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

            {/* Display Image Upload */}
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
              label="Farm Name(It must be unique)"
              fullWidth
              margin="normal"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
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
        )}
      </Formik>
    </Box>
  );
};

export default FarmerReg;