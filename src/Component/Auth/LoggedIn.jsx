import React, { useEffect } from 'react'
import * as Yup from 'yup'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../State/authSlice';
import { toast } from 'react-toastify';

function LoggedIn() {
const {success,error,user,isAdmin}=useSelector((state)=>state.auth);
console.log("Users: ",isAdmin);
const dispatch=useDispatch();

   const navigate=useNavigate();
  const ValidationScheme=Yup.object({
  
      email:Yup.string().required('email is required'),
      password:Yup.string().required('Password is required'),
    
    })
  
    const initialValues = {
    email: '',
    password: '',
    
  };

useEffect(() => {
  console.log('Effect triggered', { success, isAdmin });
  if (success) {
    console.log('Success condition met');
    toast.success(success);
    console.log('Current isAdmin:', isAdmin);
    if (isAdmin) {
      console.log('Redirecting to admin dashboard');
      navigate('/admin/dashboard');
    } else {
      console.log('Redirecting to home');
      navigate('/');
    }
  }
}, [success, isAdmin, navigate]);
  return (
      <div>
       {error && (
  <Typography variant="h4" color="error" className="text-center">
    {error}
  </Typography>
)}

      <Typography variant="h4" className="text-center">
       Login 
      </Typography>

      <Formik
        initialValues={
         initialValues
        }
        validationSchema={ValidationScheme}
        onSubmit={ (values) => {
     const resultaction = dispatch(loginUser(values));
        //  if(loginUser.fulfilled.match(resultaction)){
        //   toast.success("Welcome! 🎉");
        //   navigate("/");
        //  }
        }}
      >
        {({values,handleChange, errors, touched }) => (
          <Form>
           
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
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don't have an account?
        <Button size="small" onClick={()=>navigate('/account/register')}>Register</Button>
      </Typography>
    </div>
  )
}

export default LoggedIn
