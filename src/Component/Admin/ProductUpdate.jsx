import React, { useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import * as Yup from 'yup'
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { Box, MenuItem, Button } from '@mui/material';

import { Card, CardContent } from '@/components/ui/card'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { FormControl, InputLabel, Select, TextField } from '@mui/material'
import axios from 'axios'
import { API_URL } from '../Config/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetProductstate, UpdateProductsss } from '../State/Products/ProductsSlice'
import { toast } from 'react-toastify'
const ProductUpdate = () => {
   const location = useLocation();
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {success,error}=useSelector((state)=>state.products)
  const searchParams = new URLSearchParams(location.search);
    const [product, setProduct] = useState(location?.state?.product || null);

  const productId = searchParams.get("id");
//  if (!product) {
//     return <div>No product data available.</div>; 
//   }
         const jwt = localStorage.getItem("jwt");

useEffect(() => {
  const fetchProduct = async () => {
    if (!product && productId) {
      try {
        const res = await axios.get(`${API_URL}/api/farmers/list/${productId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product by ID:", err);
      }
    }
  };
  fetchProduct();
}, [product, productId]);

useEffect(() => {
  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  };
  loadModels();
}, []);

    useEffect(()=>{
      if(success){
        toast.success(success)
        dispatch(resetProductstate())
      }
     
    },[success])
    useEffect(()=>{
      if(error){
        toast.error(error)
      }
              dispatch(resetProductstate())

     
    },[error])
console.log(product);
    const measurement=[
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
   const initialValues = {
     name: product?.name || '',
  image: product?.image || [],
  price: product?.price || '',
  measurement: product?.measurement || '',
  producttype: product?.producttype ||product?.type || '',
  }
  const validationSchema=Yup.object({
    name:Yup.string().required("Product name is required"),
image: Yup.array()
  .of(Yup.string().url("Each image must be a valid URL"))
  .min(1, "At least one image is required"),
      measurement:Yup.string().required("Product measurement is required"),
    producttype:Yup.string().required("Product type is required"),
  })

  const handleSubmit=(values)=>{
    console.log("Form Submitted: ",values)
    dispatch(UpdateProductsss({credentials:values,jwt,navigate,productId}))
    
  }

  const handleRemoveImage=(index,values,setFieldValue)=>{
    const updated=[...values.image]
    updated.splice(index,1)
    setFieldValue('image',updated);
  }
    return (
    <div className='mx-auto max-w-2xl p-4 ml-3 sm:ml-0'>
      <Card>
              <h2 className='text-xl font-bold text-center'>Update Products :{product.name}</h2>
              <CardContent>
                <Formik 
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                  {({setFieldValue,values})=>(
                       <Form className='space-y-4'>
<FormControl fullWidth margin='normal'>
  <label htmlFor="image" className='cursor-pointer inline-block'>
<AddPhotoAlternateIcon fontSize='large'/>
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
<ErrorMessage name='image'
component='div'
className='text-red-500'/>
</FormControl>

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

<Field as={TextField} name='name' label='Product Name' fullWidth margin='normal'/>
<Field as={TextField} name='price' label='Price' fullWidth margin='normal'/>
<FormControl fullWidth margin='normal'>
<InputLabel id='measurement-label'>Measurement</InputLabel>
<Field as={Select}
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

export default ProductUpdate
