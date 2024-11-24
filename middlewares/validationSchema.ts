import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  telephone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number is not valid"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});
