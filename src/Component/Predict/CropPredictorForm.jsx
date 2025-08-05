import React, { useEffect } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../Config/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  N: '',
  P: '',
  K: '',
  temperature: '',
  humidity: '',
  ph: '',
  rainfall: ''
};

const validationSchema = Yup.object({
  N: Yup.number().required('Required'),
  P: Yup.number().required('Required'),
  K: Yup.number().required('Required'),
  temperature: Yup.number().required('Required'),
  humidity: Yup.number().required('Required'),
  ph: Yup.number().required('Required'),
  rainfall: Yup.number().required('Required')
});

const CropPredictorForm = () => {
  const { farmer } = useSelector((state) => state.farmer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!farmer) {
      navigate("/", { 
        state: { 
          message: "You need to be a farmer to access this feature" 
        } 
      });
    }
  }, [farmer, navigate]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await axios.post(`${API_URL}/api/predict`, values, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      toast.success(`Suggested crop: ${response.data.predictedCrop}`);
    } catch (error) {
      toast.error('Prediction failed');
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <Box className='max-w-md mx-auto mt-8 p-4'>
      <Card>
        <Typography variant='h5' align='center' mt={2}>
          Crop Prediction Form
        </Typography>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {Object.keys(initialValues).map((field) => (
                  <div key={field}>
                    <Field
                      as={TextField}
                      name={field}
                      type='number'
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      fullWidth
                      margin='normal'
                      validate={(value) => {
                        if (value < 0) return "Value must be positive";
                      }}
                      inputProps={{ min: 0 }}
                    />
                    <ErrorMessage
                      name={field}
                      component='div'
                      className='text-red-500 text-sm'
                    />
                  </div>
                ))}

                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  Predict Crop
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CropPredictorForm;