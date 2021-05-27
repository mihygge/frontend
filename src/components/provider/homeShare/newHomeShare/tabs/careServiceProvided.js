import React, { useEffect, useState }  from 'react';
import { Formik } from 'formik';
import cogoToast from 'cogo-toast'
import { withRouter } from 'react-router-dom';

import FormCheck from '../../../../shared/formCheckOrRadio';
import { UpdateCare as UpdateCareApi} from '../../../../../api/senior_living'
import { useServiceMapping } from '../../../../../effects/care_services_facility/use_service_mapping'
import { KeyToString } from '../../../../../utils/users'
import { getServiceDetailsApi } from '../../../../../api/updateServiceFunctionality/getServiceDetails';

const onSubmitFormatValues = (values, serviceMapping) => {
    let selected_services_attributes = []
    Object.keys(values).forEach(key => {
        if(values[key] && serviceMapping[key]){
            let service_type_id = serviceMapping[key]["serviceType"]
            let service_id = serviceMapping[key]["serviceId"]
            selected_services_attributes.push({
                service_type_id,
                service_id
            })
        }
    })
    return selected_services_attributes
} 

const getAvailableServices = (values, serviceMapping, care_services_types) => {
    const availableServices = []
    const valid_care_services = Object.keys(care_services_types['care_provided']['services'])
    Object.keys(values).forEach(key => {
        if(values[key] && serviceMapping[key] && valid_care_services.includes(key) ){
            availableServices.push({name: KeyToString(key), value: serviceMapping[key]['serviceId']})
        }
    })
    return availableServices
}

export const DynamicCheckBox = ({provided_services, keyName, values, setFieldValue}) => (
    <div className="checks-holder"> 
        {Object.keys(provided_services?.[keyName]?.['services'] || {}).map((key, i) => 
            <FormCheck key={i} type="checkbox" name={key} id={key} labelText={provided_services[keyName]['services'][key]['labelText']} onChange={(e) => setFieldValue(key, !values?.[key])} checked={values?.[key]}/>                                 
        )}
    </div>
)

let isUpdate = false;
let previouslySelectedServices = {};

const CareServiceProvided = (props) => {
    const [previouslySelectedServicesState, setPreviouslySelectedServicesState] = useState(previouslySelectedServices);

    isUpdate = props.isUpdate;

    const { provided_services, setAvailableServices } = props
    const { serviceMapping, formValues } = useServiceMapping(provided_services)

    const [FormValues, setFormValues] = useState(formValues)

    useEffect(() => {
        isUpdate && fetchServiceDetails();
    }, [])
    
    useEffect(() => {
        // For setting care type for room details tab in case of update
        if(isUpdate && Object.entries(provided_services).length > 0 && Object.entries(serviceMapping).length > 0){
            setAvailableServices(getAvailableServices(previouslySelectedServicesState, serviceMapping, provided_services))
        }
    }, [previouslySelectedServicesState, provided_services, serviceMapping])

    const fetchServiceDetails = async() => {
        const response = await getServiceDetailsApi(props.match?.params?.careId, 'service_details')
        const { selected_services } = response.data;
        let previouslySelectedServices = {};
        for(let i=0;i<selected_services.length;i+=1){
            const key = selected_services[i]?.name?.toLowerCase()?.split(' ')?.join('_')
            previouslySelectedServices[key] = true
        }
        setPreviouslySelectedServicesState({...previouslySelectedServices})

        const updatedFormValues = {
            ...formValues,
            ...previouslySelectedServices
        }

        setFormValues(updatedFormValues)
    }   
    
    return(
        <CareServiceProvided1 {...props} FormValues={FormValues}/>
    )
}


const CareServiceProvided1 = (props) => {
    const {care_id, setactiveTab, bindSubmitForm, provided_services, setAvailableServices} = props
    
    const { serviceMapping } = useServiceMapping(provided_services)
    
    useEffect(() => {
        if(props.activeMainTab === '4' ){
            props.setSaveNextButton(true)
        }
    }, [props.activeMainTab])

    const other_service_types = [
        'transportation',
        'fitness',
        'personal_hygiene',
        'recreation',
        'medication_management',
        'dining',
        'visual_&_auditory_aids',
    ]
    
    
    const validate = (values, props /* only available when using withFormik */) => {
        const errors = {};
        const isValidate = (key) => !!values[key]
        const care_service_types = Object.keys(provided_services['care_provided']['services'])
        if(!care_service_types.some(isValidate)){
            errors.error_message = 'At least one of care provider service should be selected'
        }
        return errors
    }
    
    return (
        <div className="form-in-new-care form-in-new-care-with-checks">
            <Formik 
                initialValues={
                    props.FormValues
                }
                validate={validate}             
                enableReinitialize={true}
                onSubmit={async (values, actions) => {
            
                    const req_body = {
                        care: {
                            selected_services_attributes:  {...onSubmitFormatValues(values, serviceMapping)},
                            type: "service_details"
                        }
                    }

                    const loadingMsg = !isUpdate ? 'Adding Care & Services Details...' : 'Updating Care & Services Details...';
                    const successMsg = !isUpdate ? 'Care & Services Details added successfully.' : 'Care & Services Details updated successfully.';
                    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });

                    try{ 
                        await UpdateCareApi(care_id, req_body)
                        hideLoading();
                        cogoToast.success(successMsg)
                        setactiveTab("5")
                        setAvailableServices(getAvailableServices(values, serviceMapping, provided_services))
                    } catch(reason){
                        hideLoading();
                        cogoToast.error('Unable to save form data')
                        if(reason.response.status === 422){
                            const {data: {errors}} = reason.response
                            actions.setFieldError('error_messages', errors?.join(' '))
                            if(reason?.response?.data?.[0] === 'cannot modify service, it\'s linked to bed, please remove bed before modifying')
                            {
                                cogoToast.error('You are trying to remove a service that is linked to a bed. Please check room details tab first.', { hideAfter: 15 })
                            }
                            else{
                                cogoToast.error('Unable to save form data')
                            }
                        } else{
                            cogoToast.error('Error on Server')
                            reason.handleGlobally && reason.handleGlobally()
                        }
                    }
                    
                }}
                
            >
            {(formikProps) => {
                const { handleSubmit, setFieldValue, values, errors } = formikProps;
                bindSubmitForm(formikProps.submitForm, 3);
                return(
                <form>
                    <div className="section-care">
                    <div className="sub-section sub-section-many">
                        
                        <div className="sub-section-item">
                        <h3>Care Provided</h3>
                        <DynamicCheckBox provided_services={provided_services}  keyName="care_provided" values={values} setFieldValue={setFieldValue}/>
                        {errors["error_message"] && (
                            <span className="error-message">{errors["error_message"]}</span>
                        )}
                        </div>

                        <div className="sub-section-item">
                        <h3>Type of House</h3>
                        <DynamicCheckBox provided_services={provided_services}  keyName="type_of_house" values={values} setFieldValue={setFieldValue}/>
                        </div>

                        <div className="sub-section-item" style={{width: '25%'}}>
                        <h3>Share room with</h3>
                        <DynamicCheckBox provided_services={provided_services}  keyName="share_room_with" values={values} setFieldValue={setFieldValue}/>
                        </div>

                        <div className="sub-section-item">
                        <h3>Services nearby</h3>
                        <DynamicCheckBox provided_services={provided_services}  keyName="services_nearby" values={values} setFieldValue={setFieldValue}/>
                        </div>

                    </div>
                    </div>
                    <hr className="seperator" />
                    <div className="section-care section-care-services">
                        <h3>Services Provided</h3>

                        <div className="sub-section">
                            <h4>General &amp; Wellness</h4>
                            <DynamicCheckBox provided_services={provided_services} keyName="general_&_wellness" values={values} setFieldValue={setFieldValue}/> 
                        </div>
                        <div className="sub-section sub-section-many">
                            {
                                other_service_types.map((service_type, index) => {
                                    return(
                                        <div key={index} className="sub-section-item">
                                            <h4>
                                                {service_type.split('_').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                            </h4>
                                            <DynamicCheckBox provided_services={provided_services} keyName={service_type} values={values} setFieldValue={setFieldValue}/>
                                        </div>
                                    )
                                
                                })
                            }
                       
                        </div>
                    </div>
                </form>)
            }}
            </Formik>
        </div>
    )
}

export default withRouter(CareServiceProvided);
