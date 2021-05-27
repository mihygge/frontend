import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { withFormik } from 'formik';
import cogoToast from 'cogo-toast'
import FormInput from '../../../../shared/formInput';
import STAFF_ROLE from '../../../../../constants/staff_roles'
import StaffDetailsValidation from '../../../../../forms/validations/senior_living_provider/staff_details.validation'
import { getServiceDetailsApi } from '../../../../../api/updateServiceFunctionality/getServiceDetails'
import {UpdateStaffDetails} from '../../../../../api/senior_living'

let setActiveTab = null, care_id = null;
let isUpdate = false;
let formInitialValues = {
    board_member: "",
    [STAFF_ROLE.OWNER]  : "",
    [STAFF_ROLE.ADMINISTRATOR]: "",
    [STAFF_ROLE.EXECUTIVE_DIRECTOR]: "",
    [STAFF_ROLE.ADMISSIONS_DIRECTOR]: "",
    [STAFF_ROLE.ACTIVITIES_DIRECTOR]: "",
    [STAFF_ROLE.SOCIAL_WORKER]: "",
    [STAFF_ROLE.MANAGER]: "",
    [STAFF_ROLE.BEREAVEMENT_COUNSELOR]: "",
    [STAFF_ROLE.MEDICATION_MANAGEMENT]: "",
    [STAFF_ROLE.CLINICIAN]: "",
    [STAFF_ROLE.IN_HOUSE_DOCTOR]: "",
    [STAFF_ROLE.IN_HOUSE_PODIARTIST]: "",
    [STAFF_ROLE.IN_HOUSE_DENTIST]: "",
    [STAFF_ROLE.IN_HOUSE_REHAB]: "",
    [STAFF_ROLE.NURSE]: "",
    [STAFF_ROLE.NURSING_ASSISTANT]: "",
    [STAFF_ROLE.CAREGIVER]: "",
    category: 'senior_living',
}

const StaffDetails = (props) => {
    isUpdate = props.isUpdate;
    const [ FormValues, setFormValues ] = useState(formInitialValues)

    useEffect(() => {
        if(isUpdate){
            fetchStaffDetails();
        }
    }, [])

    useEffect(() => {
        if(props.activeMainTab === '2' ){
            props.setSaveNextButton(true)
        }
    }, [props.activeMainTab])

    const fetchStaffDetails = async() => {
        try{
            
            const response = await getServiceDetailsApi(props.match?.params?.careId, 'staff_details');
            const { board_members, staff_details } = response.data;
            const data = {
                ...formInitialValues,
                board_member: board_members,
            }
        
            staff_details.forEach((staff, index) => (
                data[staff.role] = staff.name
            ))
            setFormValues(data);
        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <StaffDetails1 {...props} FormValues={FormValues} />
    )
}

const MyForm = (props) => {
    const {
        handleSubmit,
        bindSubmitForm
    } = props;

    setActiveTab = props.setactiveTab;
    care_id = props.care_id;
    
    bindSubmitForm(props.submitForm, 1);
    return (
        <div className="form-in-new-care">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Board Members" name="board_member" placeholder="Enter board member details here (Ex - Kim, John)" required="required"/>
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Owner" name={STAFF_ROLE.OWNER} placeholder="Enter owner name here" />
                        <FormInput type="text" labelText="Administrator" name={STAFF_ROLE.ADMINISTRATOR} placeholder="Enter administrator name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Executive Director" name={STAFF_ROLE.EXECUTIVE_DIRECTOR} placeholder="Enter executive director name here" />
                        <FormInput type="text" labelText="Admissions Director" name={STAFF_ROLE.ADMISSIONS_DIRECTOR} placeholder="Enter admissions director name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Activities Director" name={STAFF_ROLE.ACTIVITIES_DIRECTOR} placeholder="Enter activities director name here" />
                        <FormInput type="text" labelText="Social Worker" name={STAFF_ROLE.SOCIAL_WORKER} placeholder="Enter social worker name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Manager" name={STAFF_ROLE.MANAGER} placeholder="Enter manager name here" />
                        <FormInput type="text" labelText="Bereavement Counselor" name={STAFF_ROLE.BEREAVEMENT_COUNSELOR} placeholder="Enter bereavement counselor name here" />
                    </div>
                    <hr />
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Medication Management Supervisor" name={STAFF_ROLE.MEDICATION_MANAGEMENT} placeholder="Enter medication management supervisor name here" />
                        <FormInput type="text" labelText="Clinician" name={STAFF_ROLE.CLINICIAN} placeholder="Enter clinician name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="In-house Doctor" name={STAFF_ROLE.IN_HOUSE_DOCTOR} placeholder="Enter in-house doctor name here" />
                        <FormInput type="text" labelText="In-house Podiatrist" name={STAFF_ROLE.IN_HOUSE_PODIARTIST} placeholder="Enter in-house podiatrist name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="In-house Dentist" name={STAFF_ROLE.IN_HOUSE_DENTIST} placeholder="Enter in-house dentist name here" />
                        <FormInput type="text" labelText="In-house Rehab/Fitness Director" name={STAFF_ROLE.IN_HOUSE_REHAB} placeholder="Enter in-house rehab/fitness director name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Nurse" name={STAFF_ROLE.NURSE} placeholder="Enter nurse name here" />
                        <FormInput type="text" labelText="Nursing Assistant" name={STAFF_ROLE.NURSING_ASSISTANT} placeholder="Enter nursing assistant name here" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Caregiver" name={STAFF_ROLE.CAREGIVER} placeholder="Enter caregiver name here" />
                    </div>
                </form>
        </div>
    )
}

const StaffDetails1 = withFormik({
    enableReinitialize: true,
    validationSchema: StaffDetailsValidation,
    mapPropsToValues: props => (props.FormValues),
    handleSubmit: async (values, { setSubmitting, setErrors }) => {
        let req_body = {}
        const roles = JSON.parse(localStorage.getItem('roles'))
        req_body['board_members'] = values['board_member']
        let staff_details_attributes = []
        let staff_role_id;
        for(let key in values) {
            if((staff_role_id = roles[key]) && values[key]){
                staff_details_attributes.push({
                    name: values[key],
                    staff_role_id: staff_role_id
                })
            }
        }
        
        req_body['staff_details_attributes'] = staff_details_attributes
        req_body['type'] = 'staff_details'
        
        const loadingMsg = !isUpdate ? 'Adding Staff Details...' : 'Updating Staff Details...';
        const successMsg = !isUpdate ? 'Staff Details added successfully.' : 'Staff Details updated successfully.';
        const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });

        try{
            await UpdateStaffDetails(care_id, req_body)
            hideLoading();
            cogoToast.success(successMsg)
            setActiveTab("3")
        }
        catch(err){
            hideLoading();
            console.log(err);
        }
    },
})(MyForm)


export default withRouter(StaffDetails);