import * as Yup from "yup";
import {
	nameRegx,
    phoneNumberRegx,
    time12Regx
} from "../../constants/customer/constantRegex";

export const askForDemoSchema = Yup.object().shape({
	name: Yup.string().trim()
		.required("Name is required")
		.min(3, "Name is too short (minimum is 3 characters)")
		.matches(nameRegx, "Please enter a valid name with no special character"),
	email: Yup.string().trim()
		.email("Please enter a valid email address")
		.required("Email is required"),
	title: Yup.string().trim()
		.required("Title is required")
		.matches(nameRegx, "Please enter a valid title with no special character"),
	phone: Yup.string()
		.matches(phoneNumberRegx, "Please enter a valid mobile number"),
	date: Yup.string()
		.required("Date is required"),
    time_zone: Yup.string()
        .required("Time Zone is required"),
	time: Yup.string()
        .required("Time is required")
        .matches(time12Regx, "Please enter a valid time in 12hr (HH:MM) format"),
	additional: Yup.string().trim()
		.max(500, "Additional Instructions length shouldn't be greater 500 characters."),
});
