import * as Yup from "yup";
import { nameRegx, phoneNumberRegx } from '../../constants/customer/constantRegex';

export const RegisterSchema = Yup.object().shape({
    first_name: Yup.string()
        .required("Please enter a valid First Name")
        .min(3, "First name is too short (minimum is 3 characters)")
        .matches(nameRegx, 'Please enter a valid name with no special character'),
    last_name: Yup.string()
        .required("Please enter a valid Last Name")
        .min(3, "Last name is too short (minimum is 3 characters)")
        .matches(nameRegx, 'Please enter a valid name with no special character'),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password should be between 6-20 characters")
        .max(20, "Password should be between 6-20 characters")
        .required("Password is required"),
    mobile: Yup.string()
        .matches(phoneNumberRegx, 'Please enter a valid mobile number'),
    password_confirmation:  Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password doesn\'t match')
        .required('Password confirm is required'),
    above18: Yup.boolean()
        .oneOf([true], "Please click this checkbox")
        .required('Can not proceed without ticking this checkbox')
})

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
})

export const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
})

export const resetPasswordSchema = Yup.object().shape({
	password: Yup.string()
		.min(6, "Password should be between 6-20 characters")
		.max(20, "Password should be between 6-20 characters")
		.required("Password is required"),
	password_confirmation:  Yup.string()
		.oneOf([Yup.ref('password'), null], 'Password doesn\'t match')
		.required('Password confirm is required'),
})

export const changePasswordSchema = Yup.object().shape({
    current_password: Yup.string()
        .min(6, "Password should be between 6-20 characters")
        .max(20, "Password should be between 6-20 characters")
        .required("Password is required"),
    password: Yup.string()
		.min(6, "Password should be between 6-20 characters")
		.max(20, "Password should be between 6-20 characters")
		.required("Password is required"),
	password_confirmation:  Yup.string()
		.oneOf([Yup.ref('password'), null], 'Password doesn\'t match')
		.required('Password confirm is required'),
})

export const updateProfileSchema = Yup.object().shape({
    first_name: Yup.string()
        .required("Please enter a valid First Name")
        .min(3, "First name is too short (minimum is 3 characters)")
        .matches(nameRegx, 'Please enter a valid name with no special character'),
    last_name: Yup.string()
        .required("Please enter a valid Last Name")
        .min(3, "Last name is too short (minimum is 3 characters)")
        .matches(nameRegx, 'Please enter a valid name with no special character'),
    mobile: Yup.string()
        .matches(phoneNumberRegx, 'Please enter a valid mobile number'),
})
