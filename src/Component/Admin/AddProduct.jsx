import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Button
} from '@mui/material'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { AddProducts } from '../State/Products/ProductsSlice'
import * as faceapi from 'face-api.js'
const AddProduct = () => {
    const { error, products, success } = useSelector((state) => state.products);
    const { farmer } = useSelector((state) => state.farmer);
      const jwt=localStorage.getItem("jwt");
  const navigate=useNavigate();
  const dispatch=useDispatch();

 if(!jwt ){
  return <Navigate to="/" state={{message:"Please login to continue"}}/>
 }
useEffect(()=>{
  const loadModels=async ()=>{
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  };
  loadModels();
},[]);

  useEffect(()=>{
    if(success){
      toast.success(success)
    }
   
  },[success])
  useEffect(()=>{
    if(error){
      toast.error(error)
    }
   
  },[error])
  const measurement = [
    'LITRE',
    'KG',
    'GM',
    'BIG_TRACTOR',
    'SMALL_TRACTOR',
    'PIECES',
    'DOZEN',
    'HALF_DOZEN',
    'MANA',
    'TON',
  ]

  const productOptions = [
    'Dairy_Product',
    'Field_Product',
    'Animal_waste',
    'Animal_Product',
    'Other_Product',
  ]

const banned=['cow','buffalo','drugs','human','man','manxey','lion','blood','tiger','dog','cat']

  const initialValues = {
    name: '',
    image: [],
    price: '',
    measurement: '',
    producttype: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Product Name is required').test('no-banned-words','product name contains inappropriate or restricted words.',(value)=>{
      if(!value)return true;
      const lower=value.toLowerCase();
      return !banned.some((word)=>lower.includes(word));
    }),
    image: Yup.array().max(1, 'At least one image is required'),
    price: Yup.number().required('Price is required'),
    measurement: Yup.string().required('Measurement is required'),
    producttype: Yup.string().required('Product Type is required'),
  })

  const handleRemoveImage = (index, values, setFieldValue) => {
    const updated = [...values.image]
    updated.splice(index, 1)
    setFieldValue('image', updated)
  }

  const handleSubmit = (values) => {
    console.log('Form submitted: ', values)
    dispatch(AddProducts({credentials:values,jwt,navigate}));
  }

  return (
    <div className='mx-auto max-w-4xl p-4 ml-3 sm:ml-0'>
      <Card className=''>
              <h2 className='text-xl font-bold text-center'>Add Products</h2>
<span className='text-red-400 font-bold m-4 p-2'>!!If you wanna list big animals there is animal section for cow and buffalo ,use that section if we find adding in this section your account will be suspended/banned.</span>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className='space-y-4'>
                {/* Upload Image */}
                <FormControl fullWidth margin='normal'>
                  <label htmlFor='image' className='cursor-pointer inline-block'>
                    <AddPhotoAlternateIcon fontSize='large' />
                  </label>
                  <input
                    id='image'
                    name='image'
                    type='file'
                    accept='image/*'
                    className='hidden'
                 onChange={async (e) => {
  const file = e.currentTarget.files[0];
  if (!file) return;

  console.log("Selected file:", file);

  const image = new Image();
  image.src = URL.createObjectURL(file);

  image.onload = async () => {
    console.log("Image loaded, running face detection...");

    const detections = await faceapi.detectAllFaces(
      image,
      new faceapi.TinyFaceDetectorOptions()
    );

    console.log("Face detections:", detections);

    if (detections.length > 0) {
      toast.error("Face detected in image. Please upload a product image only.");
      return;
    }

    // No face detected, proceed
    console.log("No face detected, uploading image...");
    const url = await uploadImagetoCloud(file);
    console.log("Image uploaded to Cloudinary. URL:", url);
    setFieldValue("image", [...values.image, url]);
  };

  image.onerror = (err) => {
    console.error("Image failed to load", err);
  };
}}

                    
                  />
                  <ErrorMessage
                    name='image'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </FormControl>

                {/* Image Preview and Remove */}
                {values.image.length > 0 && (
                  <Box display='flex' gap={2} flexWrap='wrap' mt={1}>
                    {values.image.map((img, index) => (
                      <Box key={index} position='relative'>
                        <img
                          src={img}
                          alt={`uploaded-${index}`}
                          style={{ width: 100, height: 100, borderRadius: 8 }}
                        />
                       <Button
  type='button'
  variant='contained'
  size='sm'
className='text-red-700'  onClick={() => handleRemoveImage(index, values, setFieldValue)}
>
  Remove
</Button>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Product Name */}
                <Field
                  as={TextField}
                  name='name'
                  label='Product Name'
                  fullWidth
                  margin='normal'
                />
    <ErrorMessage
                    name='name'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                {/* Price */}
                <Field
                  as={TextField}
                  name='price'
                  label='Product Price'
                  type='number'
                  fullWidth
                  margin='normal'
                />

                {/* Measurement Dropdown */}
                <FormControl fullWidth margin='normal'>
                  <InputLabel id='measurement-label'>Measurement</InputLabel>
                  <Field
                    as={Select}
                    labelId='measurement-label'
                    name='measurement'
                    value={values.measurement}
                    onChange={(e) =>
                      setFieldValue('measurement', e.target.value)
                    }
                  >
                    {measurement.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name='measurement'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </FormControl>

                {/* Product Type Dropdown */}
                <FormControl fullWidth margin='normal'>
                  <InputLabel id='product-type-label'>Product Type</InputLabel>
                  <Field
                    as={Select}
                    labelId='product-type-label'
                    name='producttype'
                    value={values.producttype}
                    onChange={(e) =>
                      setFieldValue('producttype', e.target.value)
                    }
                  >
                    {productOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name='producttype'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </FormControl>

                <Button type='submit' className='w-full text-gray-900'>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProduct
