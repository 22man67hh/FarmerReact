import { Card, CardContent } from '@/components/ui/card';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  Input
} from '@mui/material';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { uploadImagetoCloud } from '../Home/Util/UploadTocloud';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Addanimal, AddProducts } from '../State/Products/ProductsSlice';
import * as faceapi from 'face-api.js';
import LeafletMap from './LeafletMap';

const AddAnimal = () => {
  const location=useLocation();
  const eddata=location.state?.animals;
  const id=eddata?.id;
      const [selectedCoords, setSelectedCoords] = useState(null);
      const [mapOpen, setMapOpen] = useState(false);
  const initialValues = {
    location: {
    latitude: eddata?.location?.latitude || '',
    longitude: eddata?.location?.longitude || '',
    address: eddata?.location?.address || ''  
  },
    animalName:eddata?.animalName|| '',
    image:eddata?.image|| [],
    age:eddata?.age|| '',
    milkPerDay:eddata?.milkPerDay|| '',
    price:eddata?.price|| '',
    description:eddata?.description|| '',
    calves:eddata?.calves|| '',
    produceMilk:eddata?.produceMilk|| false,
    gender:eddata?.gender|| '',
  };

  const { error, products, success } = useSelector((state) => state.products);
  const { farmer } = useSelector((state) => state.farmer);
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState(initialValues);
  const [predictionPrice, setPredictionPrice] = useState(null);
 
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const estimateCowPrice = (milkPerDay, age, calves) => {
    if (!milkPerDay || !age || !calves) return null;

    const milk = parseFloat(milkPerDay);
    const ageNum = parseInt(age);
    const calvings = parseInt(calves);

    const milkRevenue = milk * 50 * 270;
    const agePenalty = ageNum > 8 ? (ageNum - 8) * 0.15 : 0;

    let breedingBonus = 0;
    if (ageNum >= 3) {
      const expectedCalvings = (ageNum - 3) / 1.16;
      const calvingDifference = calvings - expectedCalvings;
      breedingBonus = calvingDifference > 0
        ? calvingDifference * 0.03
        : calvingDifference * 0.05;
    }

    const price = milkRevenue * (1 - agePenalty) * (1 + breedingBonus);
    return price.toFixed(2);
  };

  useEffect(() => {
    const { produceMilk, milkPerDay, age, calves } = formValues;
    if (produceMilk && milkPerDay && age && calves) {
      const price = estimateCowPrice(milkPerDay, age, calves);
      setPredictionPrice(price);
    } else {
      setPredictionPrice(null);
    }
  }, [formValues]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const gender = ['MALE', 'FEMALE'];
  const animal = ['COW', 'BUFFALO'];

  const validationSchema = Yup.object({
    animalName: Yup.string().required('Animal Name is required'),
    image: Yup.array().min(1, 'At least one image is required'),
    age: Yup.string().required('Age is required'),
    calves: Yup.string().required('Calves count is required'),
    gender: Yup.string().required('Gender is required'),
    price: Yup.number().required('Price is required')
  });

  const handleRemoveImage = (index, values, setFieldValue) => {
    const updated = [...values.image];
    updated.splice(index, 1);
    setFieldValue('image', updated);
  };

  const handleSubmit = (values) => {
    dispatch(Addanimal({ credentials: values, jwt, navigate }));
  };

  return (
    <div className='mx-auto max-w-4xl p-4 ml-3 sm:ml-0'>
      <Card>
        <h2 className='text-xl font-bold text-center'>Add Animals</h2>
        <span className='text-red-400 font-bold m-4 p-2'>
          !!If you want to list Products, use the Product section. Using this section improperly may result in suspension.
        </span>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => {
              useEffect(() => {
                setFormValues(values);
              }, [values]);

               useEffect(() => {
    if (selectedCoords) {
      const fetchAddress = async () => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${selectedCoords.lat}&lon=${selectedCoords.lng}`
        );
        const data = await res.json();
      if (data?.display_name) {
setFieldValue('location', {
          latitude: selectedCoords.lat,
          longitude: selectedCoords.lng,
          address: data.display_name,
        });}

      };
      fetchAddress();
    }
  }, [selectedCoords]);
              return (
                <Form className='space-y-4'>
                  {/* Image Upload */}
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

                        const image = new Image();
                        image.src = URL.createObjectURL(file);

                        image.onload = async () => {
                          const detections = await faceapi.detectAllFaces(
                            image,
                            new faceapi.TinyFaceDetectorOptions()
                          );
                          if (detections.length > 0) {
                            toast.error("Face detected in image. Please upload a product image only.");
                            return;
                          }

                          const url = await uploadImagetoCloud(file);
                          setFieldValue("image", [...values.image, url]);
                        };
                      }}
                    />
                    <ErrorMessage name='image' component='div' className='text-red-500 text-sm' />
                  </FormControl>

                  {/* Image Preview */}
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
                            className='text-red-700'
                            onClick={() => handleRemoveImage(index, values, setFieldValue)}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Animal Type */}
                  <FormControl fullWidth margin='normal'>
                    <InputLabel id='animal-label'>Animal Type</InputLabel>
                    <Field
                      as={Select}
                      labelId='animal-label'
                      name='animalName'
                      value={values.animalName}
                      onChange={(e) => setFieldValue('animalName', e.target.value)}
                    >
                      {animal.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name='animalName' component='div' className='text-red-500 text-sm' />
                  </FormControl>

                  {/* Produce Milk Checkbox */}
                  <FormControlLabel
                    control={
                      <Field
                        as={Checkbox}
                        name="produceMilk"
                        color="primary"
                        type="checkbox"
                        checked={values.produceMilk}
                        onChange={() => setFieldValue('produceMilk', !values.produceMilk)}
                      />
                    }
                    label="Produce Milk?"
                  />

                  {/* Milk, Age, Calves */}
                {values.produceMilk &&  <Field as={TextField} name='milkPerDay' label='Milk Per Day (L)' type='number' fullWidth margin='normal'  inputProps={{ min: 0 }} />}
                  <Field as={TextField} name='age' label='Age (Years)' type='number' fullWidth margin='normal' inputProps={{min:1}} />
                  <ErrorMessage name='age' component='div' className='text-red-500 text-sm' />
                  <Field as={TextField} name='calves' label='Total Calves' type='number' fullWidth margin='normal'  inputProps={{ min: 0 }} />
                  <ErrorMessage name='calves' component='div' className='text-red-500 text-sm' />
                  <Field as={TextField} name='description' label='Description' type='text' fullWidth margin='normal'multiline rows={4} />
                  <ErrorMessage name='description' component='div' className='text-red-500 text-sm' />

                  {/* Gender */}
                  <FormControl fullWidth margin='normal'>
                    <InputLabel id='gender-label'>Gender</InputLabel>
                    <Field
                      as={Select}
                      labelId='gender-label'
                      name='gender'
                      value={values.gender}
                      onChange={(e) => setFieldValue('gender', e.target.value)}
                    >
                      {gender.map((g) => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name='gender' component='div' className='text-red-500 text-sm' />
                  </FormControl>

                  {values.produceMilk && predictionPrice && (
                    <div className="bg-green-100 text-green-800 p-2 rounded-md font-semibold">
                      Estimated Cow Price: NPR {predictionPrice}
                    </div>
                  )}

                  {/* Final Price */}
                  <Field as={TextField} name='price' label='Animal Price (NPR)' type='number' fullWidth margin='normal'  inputProps={{ min: 1000 }}/>
                  <ErrorMessage name='price' component='div' className='text-red-500 text-sm' />

 <Button variant="outline" onClick={() => setMapOpen(true)} className='w-full m-3 p-4 bg-green-300 text-white'>Pick Location on Map</Button>

            {selectedCoords && (
              <p className="text-sm text-gray-700">
                Selected Coords: {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
              </p>
            )}
            <Input
  placeholder="Selected address"
  value={values.location?.address || ''}
  onChange={(e) =>
    setFieldValue('location', {
      ...values.location,
      address: e.target.value,
    })
  }
/>
                  <Button type='submit' className='w-full text-gray-900 m-4' variant='contained'>
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>
        <Dialog open={mapOpen} onClose={() => setMapOpen(false)} fullWidth maxWidth="md">
              <div className="p-4">
                <LeafletMap
                  setSelectedPosition={(pos) => {
                    setSelectedCoords(pos);
                    setMapOpen(false);
                  }}
                />
              </div>
            </Dialog>
    </div>
  );
};

export default AddAnimal;
