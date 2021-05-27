import * as Yup from "yup";

export const StripeAccountSchema = Yup.object().shape({
    business_type: Yup.string()
        .required("business type is required"),
    bank_account: Yup.string()
        .required("Please enter bank account number")
        .matches(/^[0-9]*$/, 'bank account number should be Numeric')
        .max(20, "should be max. of 20 digits"),
    routing_number: Yup.string()
        .required("Routing number is required")
        .matches(/^[0-9]*$/, 'routing number should be Numeric')
        .max(20, "should be max. of 20 digits"),
})