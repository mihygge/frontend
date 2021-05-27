import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import cogoToast from 'cogo-toast'
import { withRouter } from 'react-router-dom'

import { useServiceMapping } from '../../../../../effects/care_services_facility/use_service_mapping'
import { UpdateCare as UpdateCareApi} from '../../../../../api/senior_living'
import {DynamicCheckBox } from './careServiceProvided'
import { getServiceDetailsApi } from '../../../../../api/updateServiceFunctionality/getServiceDetails';

const onSubmitFormatValues = (values, serviceMapping) => {
    let selected_facilities_attributes = []
    Object.keys(values).forEach(key => {
        if(values[key] && serviceMapping[key]){
            let facility_type_id = serviceMapping[key]["serviceType"]
            let facility_id = serviceMapping[key]["serviceId"]
            selected_facilities_attributes.push({
                facility_type_id,
                facility_id
            })
        }
    })
    return selected_facilities_attributes
} 

let isUpdate = false;
const FacilitiesAndSafety = (props) => {

    isUpdate = props.isUpdate;

    const { facilities } = props;
    const { formValues } = useServiceMapping(facilities);
    const [FormValues, setFormValues] = useState(formValues);

    useEffect(() => {
        isUpdate && getFacilityDetails();
    }, []);

    const getFacilityDetails = async() => {
        const response = await getServiceDetailsApi(props.match?.params?.careId, 'facility_details');
        const { selected_facilities } = response.data;
        
        let previouslySelectedFacilities = {};
        for(let i=0;i<selected_facilities.length;i+=1){
            const key = selected_facilities[i]?.name?.toLowerCase()?.split(' ')?.join('_')
            previouslySelectedFacilities[key] = true
        }

        const updatedFormValues = {
            ...formValues,
            ...previouslySelectedFacilities,
        }

        setFormValues(updatedFormValues)
    }
    
    return(
        <FacilitiesAndSafety1 {...props} FormValues={FormValues}/>
    )
}

const FacilitiesAndSafety1 = (props) => {
    const {care_id, setactiveTab, bindSubmitForm, facilities} = props

    useEffect(() => {
        if(props.activeMainTab === '5' ){
            props.setSaveNextButton(true)
        }
    }, [props.activeMainTab])

    const { serviceMapping } = useServiceMapping(facilities)
    const safety_facilities = [
        'fire',
        'lighting',
        'general',
        '24_hours'
    ]
    return (
        <div className="form-in-new-care form-in-new-care-with-checks">
            <Formik
                initialValues={props.FormValues}
                enableReinitialize={true}
                onSubmit={async (values, actions) => {
                    const selected_facilities_attributes = onSubmitFormatValues(values, serviceMapping)
                    if(selected_facilities_attributes.length === 0){
                        cogoToast.info('Not checked any value, so moving to next tab.')
                        setactiveTab("6")
                        return
                    }
                    const req_body = {
                        care: {
                            selected_facilities_attributes:  onSubmitFormatValues(values, serviceMapping),
                            type: 'facility_details'
                        }
                    }

                    const loadingMsg = !isUpdate ? 'Adding Facilities & Safety Details...' : 'Updating Facilities & Safety Details...';
                    const successMsg = !isUpdate ? 'Facilities & Safety Details added successfully.' : 'Facilities & Safety Details updated successfully.';
                    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });

                    try{ 
                        await UpdateCareApi(care_id, req_body)
                        hideLoading();
                        cogoToast.success(successMsg)
                        setactiveTab("6")
                    }catch(reason){
                        hideLoading();
                        cogoToast.error('Unable to save form data')
                        if(reason.response.status === 422){
                            const {data: {errors}} = reason.response
                            actions.setFieldError('error_messages', errors?.join(' '))
                        } else{
                            reason.handleGlobally && reason.handleGlobally()
                        }
                    }
                }}
            >
                {(formikProps) => {
                    const { handleSubmit, setFieldValue, values, errors } = formikProps;
                    bindSubmitForm(formikProps.submitForm, 4);
                    return(
                    
                        <form>
                            {errors["error_messages"] && (
                                <span className="error-message">{errors["error_messages"]}</span>
                            )}
                            <div className="section-care">
                                <div className="sub-section sub-section-wellness">
                                    <h4>General &amp; Wellness</h4>
                                    <DynamicCheckBox keyName="general_&_wellness" provided_services={facilities} values={values} setFieldValue={setFieldValue} />
                                </div>
                            </div>
                            <div className="section-care">
                                <div className="sub-section sub-section-many sub-section-facilities">
                                    { 
                                        Object.keys(facilities).filter(key => !(key === 'general_&_wellness' || safety_facilities.includes(key)) ).map((facility_type, index) => {
                                            return(
                                                <div className="sub-section-item" key={index}>
                                                    <h4>
                                                        {facilities[facility_type]?.['labelText']}
                                                    </h4>
                                                    <DynamicCheckBox keyName={facility_type} provided_services={facilities} values={values} setFieldValue={setFieldValue} />
                                                </div>
                                                
                                            )
                                        
                                        })
                                    
                                    }
                                </div>
                            </div>
                            <hr className="seperator" />
                            <div className="section-care section-care-services">
                                <h3>Safety Facilities</h3>
                                <div className="sub-section sub-section-many sub-section-facilities">
                                    {
                                        safety_facilities.map((facility_type, index) => {
                                            return(
                                                <div key={index} className="sub-section-item">
                                                    <h4>
                                                        {facilities[facility_type]?.['labelText']}
                                                    </h4>
                                                    <DynamicCheckBox keyName={facility_type} provided_services={facilities} values={values} setFieldValue={setFieldValue} />
                                                </div>
                                                
                                            )
                                    
                                        })
                                    }
                                </div>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default withRouter(FacilitiesAndSafety);