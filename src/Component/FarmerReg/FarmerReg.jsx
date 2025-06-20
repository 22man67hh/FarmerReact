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
import {useDispatch, useSelector} from "react-redux"
import * as Yup from 'yup'
import { Checkbox } from '@mui/material';
import { Image } from '@mui/icons-material';
import { createFarmer } from '../State/Farmer/FarmerSlie';
import { toast } from 'react-toastify';
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const FarmerReg = () => {
  const { email, name, jwt } = useSelector((state) => state.auth);
  const { error, farmer, success } = useSelector((state) => state.farmer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [uploadImage, setUploadImage] = useState(false);
const[displayImg,setDisplayImg]=useState(false);
  useEffect(() => {
    if (success) {
      toast.success(success);
      navigate("/");
    }
  }, [success, navigate]);

  const productOptions = [
    "Dairy_Product",
    "Field_Product",
    "Animal_waste",
    "Animal_Product",
    "Other_Product"
  ];

  const initialValues = {
    name: name || "",
    citizenno: "",
    houseno: "",
    phone: "",
    facebook: "",
    email: email || "",
    productType: [],
    images: [],
    displayImages: [],
  };

  const ValidationScheme = Yup.object({
    name: Yup.string().required("Full name is required"),
    citizenno: Yup.string().required("Citizenship No is required"),
    houseno: Yup.string().required("House no is required"),
    phone: Yup.string().max(10).required("Phone no is required"),
    facebook: Yup.string().required("Facebook URL is required"),
    productType: Yup.array().min(1, "At least one product type must be selected"),
    images: Yup.array().min(1, "At least one image is required"),
    displayImages: Yup.array().min(1, "Please fill the required form")
  });

  const handleImageChange = async (e, values, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadImage(true);
    const imageUrl = await uploadImagetoCloud(file);
    setUploadImage(false);
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
    setDisplayImg(true);
    const imageUrl = await uploadImagetoCloud(file);
    setDisplayImg(false);
    setFieldValue("displayImages", [...values.displayImages, imageUrl]);
  };

  const handleRemovedisImage = (index, values, setFieldValue) => {
    const updated = [...values.displayImages];
    updated.splice(index, 1);
    setFieldValue("displayImages", updated);
  };

  return (
    <div>
      {error && <Typography variant="h4" color="error" className="text-center">{error}</Typography>}
      <Typography variant="h4" className="text-center mb-6">Register Farmer Here</Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={ValidationScheme}
        onSubmit={(values) => {
          dispatch(createFarmer({ jwt, data: values }));
        }}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <Form>
            {/* Image Upload */}
            <FormControl fullWidth margin="normal">
              <label className="relative" htmlFor="image-upload">
                <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md border-gray-600">
                  <AddPhotoAlternateIcon />
                </span>
                {uploadImage && <CircularProgress size={24} className="absolute top-0 left-0" />}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, values, setFieldValue)}
                hidden
              />
              {errors.images && touched.images && (
                <Typography color="error" variant="caption">{errors.images}</Typography>
              )}
               <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {values.images.map((img, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <img src={img} alt="upload" style={{ height: 100, borderRadius: 4 }} />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index, values, setFieldValue)}
                    >Remove</Button>
                  </Box>
                ))}
              </Box>
              <label className="relative" htmlFor="image-upload">
                <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md border-gray-600">
                  <AddPhotoAlternateIcon />
                </span>
                {displayImg && <CircularProgress size={24} className="absolute top-0 left-0" />}
              </label>
              <input
                id="disimage-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleDisplayImage(e, values, setFieldValue)}
                hidden
              />
              {errors.images && touched.images && (
                <Typography color="error" variant="caption">{errors.images}</Typography>
              )}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {values.displayImages.map((img, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <img src={img} alt="upload" style={{ height: 100, borderRadius: 4 }} />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemovedisImage(index, values, setFieldValue)}
                    >Remove</Button>
                  </Box>
                ))}
              </Box>
            </FormControl>

            {/* Other Fields */}
            <Field as={TextField} name="name" label="Full Name" fullWidth margin="normal"
              error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
            <Field as={TextField} name="email" label="Email" fullWidth margin="normal" disabled />
            <Field as={TextField} name="citizenno" label="Citizen No" fullWidth margin="normal"
              error={touched.citizenno && !!errors.citizenno} helperText={touched.citizenno && errors.citizenno} />
            <Field as={TextField} name="houseno" label="House No" fullWidth margin="normal"
              error={touched.houseno && !!errors.houseno} helperText={touched.houseno && errors.houseno} />
            <Field as={TextField} name="phone" label="Phone No" fullWidth margin="normal"
              error={touched.phone && !!errors.phone} helperText={touched.phone && errors.phone} />
            <Field as={TextField} name="facebook" label="Facebook URL" fullWidth margin="normal"
              error={touched.facebook && !!errors.facebook} helperText={touched.facebook && errors.facebook} />

            {/* Product Types */}
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Product Type</InputLabel>
              <FormGroup>
                <div className='flex flex-wrap gap-3'>
                  {productOptions.map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={values.productType.includes(option)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFieldValue("productType", checked
                              ? [...values.productType, option]
                              : values.productType.filter(p => p !== option));
                          }}
                        />
                      }
                      label={option.replace("_", " ")}
                    />
                  ))}
                </div>
              </FormGroup>
              {touched.productType && errors.productType && (
                <Typography color="error" variant="caption">{errors.productType}</Typography>
              )}
            </FormControl>

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, p: 2 }}>Register</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FarmerReg;

