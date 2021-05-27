import * as Yup from "yup";
import STAFF_ROLE from '../../../constants/staff_roles';
import { nameRegx, noWhiteSpace } from '../../../constants/customer/constantRegex';

const StaffDetails = Yup.object().shape({
    board_member: Yup
        .string()
        .when('category', {
            is: 'senior_living',
            then: Yup.string()
                .trim()
                .matches(noWhiteSpace, 'Remove empty space')
                .required("Board member name is required"),
            otherwise: Yup.string()
                .trim()
                .matches(noWhiteSpace, 'Remove empty space')
        }),
    [STAFF_ROLE.OWNER]: Yup
        .string()
        .when('category', {
            is: 'home_share',
            then: Yup.string().trim()
                .required(`${[STAFF_ROLE.OWNER]} name is required`)
                .matches(nameRegx, 'no special characters, only alphanumeric values')
                .max(100, `${[STAFF_ROLE.OWNER]}'s name shouldn't be greater than 100 characters.`),
            otherwise: Yup.string().trim()
                .matches(nameRegx, 'no special characters, only alphanumeric values')
                .max(100, `${[STAFF_ROLE.OWNER]}'s name shouldn't be greater than 100 characters.`)
        }),
    [STAFF_ROLE.ADMINISTRATOR]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.ADMINISTRATOR]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.EXECUTIVE_DIRECTOR]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.EXECUTIVE_DIRECTOR]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.ADMISSIONS_DIRECTOR]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.ADMISSIONS_DIRECTOR]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.ACTIVITIES_DIRECTOR]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.ACTIVITIES_DIRECTOR]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.SOCIAL_WORKER]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.SOCIAL_WORKER]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.MANAGER]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.MANAGER]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.BEREAVEMENT_COUNSELOR]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.BEREAVEMENT_COUNSELOR]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.MEDICATION_MANAGEMENT]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.MEDICATION_MANAGEMENT]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.CLINICIAN]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.CLINICIAN]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.IN_HOUSE_DOCTOR]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.IN_HOUSE_DOCTOR]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.IN_HOUSE_PODIARTIST]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.IN_HOUSE_PODIARTIST]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.IN_HOUSE_DENTIST]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.IN_HOUSE_DENTIST]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.IN_HOUSE_REHAB]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.IN_HOUSE_REHAB]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.NURSE]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.NURSE]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.NURSING_ASSISTANT]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.NURSING_ASSISTANT]}'s name shouldn't be greater than 100 characters.`),
    [STAFF_ROLE.CAREGIVER]: Yup.string().trim()
        .matches(nameRegx, 'no special characters, only alphanumeric values')
        .max(100, `${[STAFF_ROLE.CAREGIVER]}'s name shouldn't be greater than 100 characters.`),
})

export default StaffDetails