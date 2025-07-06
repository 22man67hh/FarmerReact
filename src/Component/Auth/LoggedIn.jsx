import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Button, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetAuthState } from '../State/authSlice';
import { toast } from 'react-toastify';
import { getRetailer } from '../State/Retailer/RetailerSlice';

function Login() {
  const { success, error, user, isAdmin, isRetailer } = useSelector((state) => state.auth);
  const { status: retailerStatus,retailer } = useSelector((state) => state.retailer); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ValidationScheme = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    const handleRedirect = async () => {
      if (success && user) {
        if (isAdmin) {
          navigate('/admin/dashboard');
          return;
        }

        if (isRetailer) {
          console.log("Is retailer",isRetailer)
          console.log("Retailer status",retailerStatus)
          console.log("Retailers",retailer)
          await dispatch(getRetailer({ userId: user.id }));
          
          switch(retailerStatus) {
            case 'CONFIRMED':
              navigate('/retailer/dashboard');
              break;
            case 'PENDING':
              navigate('/retailer/application-status');
              break;
            default:
              navigate('/retailer/register');
          }
          return;
        }

        navigate('/');
      }
    };

    handleRedirect();
  }, [success, isAdmin, isRetailer, retailerStatus, navigate, dispatch, user]);

  return (
    <div className="login-container">
      {error && (
        <Typography variant="h6" color="error" className="text-center">
          {error}
        </Typography>
      )}

      <Typography variant="h4" className="text-center" gutterBottom>
        Login
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={ValidationScheme}
        onSubmit={(values) => {
          dispatch(loginUser(values));
        }}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="login-form">
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            
            <Button
              sx={{ mt: 3, padding: "1rem" }}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don't have an account?{' '}
        <Button 
          size="small" 
          onClick={() => navigate('/account/register')}
          color="secondary"
        >
          Register
        </Button>
      </Typography>
    </div>
  );
}

export default Login;