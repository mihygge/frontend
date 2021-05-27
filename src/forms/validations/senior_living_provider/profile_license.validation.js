import * as Yup from "yup";
import { lettersWithSpaces, numeric, alphanumeric, faxNumRegex } from '../../../constants/regex';

let ProfileLicenseSchema;
export default ProfileLicenseSchema = Yup.object().shape({
    "name": Yup.string().trim()
        .required("Name is required")
        .matches(alphanumeric, 'no special characters, only alphanumeric values')
        .min(5, "Name shouldn't be less than 5 or greater 30 characters.")   
        .max(30, "Name shouldn't be less than 5 or greater 30 characters."),
    "address1": Yup.string().trim()
        .required("Address is required")
        .min(6, "Address length shouldn't be less than 6 or greater 50 characters.")
        .max(50, "Address length shouldn't be less than 6 or greater 50 characters."),
    "address2": Yup.string().trim()
        .min(6, "Address length shouldn't be less than 6 or greater 50 characters.")
        .max(50, "Address length shouldn't be less than 6 or greater 50 characters.")
        .nullable(),
    "address3": Yup.string().trim()
        .min(6, "Address length shouldn't be less than 6 or greater 50 characters.")
        .max(50, "Address length shouldn't be less than 6 or greater 50 characters..")
        .nullable(),
    "city": Yup.string().trim()
        .required('City Name is required')
        .matches(lettersWithSpaces, 'no special characters and numbers, only letters')
        .min(3, "City field shouldn't be less than 3 or greater than 20 characters")
        .max(20, "City field shouldn't be less than 3 or greater than 20 characters"),
    "state": Yup.string().trim()
        .required('State Name is required')
        .matches(lettersWithSpaces, 'no special characters and numbers, only letters')
        .min(3, `State field shouldn't be less than 3 or greater than 20 characters`)
        .max(20, `State field shouldn't be less than 3 or greater than 20 characters`),
    "county": Yup.string().trim()
        .min(3, `County field shouldn't be less than 3 or greater than 20 characters`)
        .required("County field is required")
        .matches(lettersWithSpaces, 'no special characters and numbers, only letters')
        .max(20, "County field shouldn't be less than 3 or greater than 20 characters"),
    "country": Yup.string().trim()
        .matches(lettersWithSpaces, 'no special characters and numbers, only letters')
        .required("Country field is required"),      
    "zipcode": Yup
        .string()
        .matches(numeric, 'Zip Code should be Numeric')
        .required("Zip Code is required")
        .max(5, "Zip Code length should be 5")
        .min(5, "Zip Code length should be 5"),
    "fax_number": Yup
        .string().trim()
        .matches(faxNumRegex, 'Fax should be numeric, must be between length of 1 and 15 digit')
        .nullable()
        .notRequired(),
    "licences_attributes": Yup
        .array()
        .when(['category', 'licences'], {
            is: (category, licences) => category === 'senior_living' && licences.length === 0 ,
            then: Yup.array().required('Must have License').min(1, 'Minimum of 1 License'),
            otherwise: Yup.array().min(0),
        })
})

