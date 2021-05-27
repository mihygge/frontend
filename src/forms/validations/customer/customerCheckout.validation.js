import * as Yup from "yup";
import { phoneNumberRegx, nameRegx } from '../../../constants/customer/constantRegex';

export const customerCheckout = Yup.object().shape({
    first_name: Yup.string().trim()
        .required("Please enter your first name")
        .matches(nameRegx, 'Please enter a valid name with no special character')
        .min(3, "First name is too short (minimum is 3 characters)"),
    last_name: Yup.string().trim()
        .required("Please enter your last name")
        .matches(nameRegx, 'Please enter a valid name with no special character')
        .min(3, "Last name is too short (minimum is 3 characters)"),
    email: Yup.string()
        .email("Please enter a valid email ID")
        .required("Please enter a valid email ID"),
    mobile: Yup.string()
        .required("Please enter a valid phone number")
        .matches(phoneNumberRegx, 'Please enter a valid phone number'),
    arrival_time: Yup.string()
        .required("Please enter a valid time in 12hr (HH:MM AM/PM) format"),
    relationship: Yup.string()
        .test({
            name: 'min_one_select',
            test: function(value){
                if (!!value) return true;
                else {
                    const error_message = "Please select the relationship";
                    return this.createError({
                        message: error_message,
                        path: "relationship",
                    });
                }
            }
        }),
    other_relation: Yup.string().trim()
        .test({
            name: 'min_one_select',
            test: function(value){
                if (!!value || !this.parent.otherSelected) return true;
                else if(this.parent.otherSelected) {
                    const error_message = "Please specify other relationship";
                    return this.createError({
                        message: error_message,
                        path: "relationship",
                    });
                }

            }
        }),
});
