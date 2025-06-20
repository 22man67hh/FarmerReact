import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CardContent
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { Card } from '@/components/ui/card'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import * as faceapi from 'face-api.js'
import { uploadImagetoCloud } from '../../Home/Util/UploadTocloud'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationVehicle, resetVehiclestate, updateVehicle } from '@/Component/State/VehicleSlice/VehicleSlice'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const AddVehicle = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const jwt=localStorage.getItem("jwt");
  const location=useLocation();
  const editData=location.state?.vehicle;
  const id = editData?.id;
const [uploading, setUploading] = useState(false);

  const {error,success}=useSelector((state)=>state.vehicles)
  const vehicleTypes = [
    'TRACTOR',
    'SMALL_TRACTOR',
    'JEEP',
    'THRESER',
    'CUTTER',
    'HAND_TRACTOR',
    'TRUCK'
  ]


  if(!jwt){
    return <Navigate to="/" state={{ message: 'Please login to continue' }} />;
  }
  const initialValues = {
    images:editData?.images|| [],
    model:editData?.model|| '',
   registration: editData?.registration || '',
  ownerName: editData?.ownerName || '',
  ownernum: editData?.ownernum || '',
  type: editData?.type || ''
  }

  useEffect(()=>{
if(success){
  toast.success(success);
  dispatch(resetVehiclestate())
}
  },[success])
  useEffect(()=>{
if(error){
  toast.error(error);
  dispatch(resetVehiclestate())
}
  },[error])

  const validationSchema = Yup.object({
    model: Yup.string().required('Model is required'),
    images: Yup.array().min(1, 'At least one image is required'),
    registration: Yup.string().required('Registration Number is required'),
    ownerName: Yup.string().required('Owner Name is required as Registration'),
    type: Yup.string().required('Vehicle Type is required')
  })

  const handleRemoveImage = (index, values, setFieldValue) => {
    const updated = [...values.images]
    updated.splice(index, 1)
    setFieldValue('images', updated)
  }

const handleSubmit = (values) => {
  console.log("I am bahira");
  if (id) {
    console.log("I am vitra")
    dispatch(updateVehicle({ id, updatedData: values, jwt, navigate }));
    return; 
  }
  dispatch(ApplicationVehicle({ credentials: values, navigate, jwt }));
}



  useEffect(()=>{
    const loadModels=async ()=>{
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };
    loadModels();
  },[]);
  

  return (
    <div className='mx-auto max-w-2xl p-4 ml-5 sm:ml-0'>
      <Card>
        <h2 className='text-xl font-bold text-center p-4'>Application For Vehicles</h2>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form>
               <FormControl fullWidth margin='normal'>
  <label htmlFor='image' className='cursor-pointer inline-block'>
    <AddPhotoAlternateIcon fontSize='large' />
  </label>
  <input
    id='image'
    name='images'
    type='file'
    accept='image/*'
    className='hidden'
    onChange={async (e) => {
      const file = e.currentTarget.files[0]
      if (!file) return

      const image = new Image()
      image.src = URL.createObjectURL(file)

      image.onload = async () => {
        const detections = await faceapi.detectAllFaces(
          image,
          new faceapi.TinyFaceDetectorOptions()
        )

        if (detections.length > 0) {
          toast.error(
            'Face detected in image. Please upload a product image only.'
          )
          return
        }

        try {
          setUploading(true)
          const url = await uploadImagetoCloud(file)
          setFieldValue('images', [...values.images, url])
        } catch (err) {
          toast.error("Image upload failed")
        } finally {
          setUploading(false)
        }
      }

      image.onerror = (err) => {
        console.error('Image failed to load', err)
      }
    }}
  />
  {uploading && (
    <div className="flex justify-center mt-2">
      <CircularProgress size={24} />
    </div>
  )}
  <ErrorMessage
    name='images'
    component='div'
    className='text-red-500 text-sm'
  />
</FormControl>


                {values.images.length > 0 && (
                  <Box display='flex' gap={2} flexWrap='wrap' mt={1}>
                    {values.images.map((img, index) => (
                      <Box key={index} position='relative'>
                        <img
                          src={img}
                          alt={`uploaded-${index}`}
                          style={{ width: 100, height: 100, borderRadius: 8 }}
                        />
                        <Button
                          type='button'
                          variant='contained'
                          size='small'
                          color='error'
                          onClick={() =>
                            handleRemoveImage(index, values, setFieldValue)
                          }
                          style={{ marginTop: 4 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}

                <FormControl fullWidth margin='normal'>
                  <InputLabel id='type-label'>Vehicle Type</InputLabel>
                  <Field
                    as={Select}
                    labelId='type-label'
                    name='type'
                    value={values.type}
                    onChange={(e) => setFieldValue('type', e.target.value)}
                  >
                    {vehicleTypes.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name='type'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </FormControl>

                <Field
                  as={TextField}
                  name='model'
                  label='Vehicle Model'
                  fullWidth
                  margin='normal'
                />
                <ErrorMessage name='model' component='div' className='text-red-500 text-sm' />

                <Field
                  as={TextField}
                  name='registration'
                  label='Vehicle Registration'
                  fullWidth
                  margin='normal'
                />
                <ErrorMessage
                  name='registration'
                  component='div'
                  className='text-red-500 text-sm'
                />

                <Field
                  as={TextField}
                  name='ownerName'
                  label='Owner Name'
                  fullWidth
                  margin='normal'
                />
                <ErrorMessage
                  name='ownerName'
                  component='div'
                  className='text-red-500 text-sm'
                />

               

                <Button type='submit' variant='contained' fullWidth sx={{ mt: 2 }} disabled={uploading}>
 {id ? 'Update Vehicle' : 'Submit'}                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddVehicle
