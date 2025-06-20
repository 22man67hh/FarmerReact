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
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import * as Yup from 'yup'
import { signUpUser } from "../State/authSlice";



const RegisterForm = () => {
  const {error,isLoading}=useSelector((state)=>state.auth)
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const ValidationScheme=Yup.object({
    fullName:Yup.string().required('Full Name is required'),
    email:Yup.string().email("Invalid email").required('email is required'),
    password:Yup.string().required('Password is required').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
  ),
    cpassword:Yup.string().oneOf([Yup.ref("password"),null],"password must match").required('Confrim Password is required'),
    role:Yup.string().required('Role is required'),
  })

  const initialValues = {
  fullName: '',
  email: '',
  password: '',
  cpassword: '',
  role: ''
};
  return (
    
    <div>


     { error &&
      <Typography variant="h4" color="error" className="text-center" sx={{marginBottom:3}}>
        {error}
      </Typography>}

      <Typography variant="h4" className="text-center">
        Register Here
      </Typography>

      <Formik
        initialValues={
         initialValues
        }
        validationSchema={ValidationScheme}
        onSubmit={(values) => {
          dispatch(signUpUser({credentials:values,navigate}));
          console.log(values);
        }}

      >
        {({values,handleChange, errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="fullName"
              label="Full Name"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.fullName && !!errors.fullName}
              helperText={touched.fullName && errors.fullName}
            />
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
            <Field
              as={TextField}
              name="cpassword"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.cpassword && !!errors.cpassword}
              helperText={touched.cpassword && errors.cpassword}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={values.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value={"ROLE_FARMER"}>Farmer</MenuItem>
                <MenuItem value={"ROLE_RETAILER"}>Retailer</MenuItem>
              </Select>
 {touched.role && errors.role && (
                <Typography color="error" variant="caption">
                  {errors.role}
                </Typography>
              )}            </FormControl>

            <Button
              sx={{ mt: 3, padding: "1rem" }}
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Already have an account?
        <Button size="small" onClick={()=>navigate('/account/login')}>Login</Button>
      </Typography>
    </div>
  );
};

export default RegisterForm;
