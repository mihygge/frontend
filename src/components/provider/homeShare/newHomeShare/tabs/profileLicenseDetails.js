import React, { useState, useEffect } from 'react';
import { Form, withFormik, ErrorMessage} from 'formik';
import FormInput from '../../../../shared/formInput';
import FileUpload from '../../../../shared/fileUpload';
import ProfileLicenseSchema  from '../../../../../forms/validations/senior_living_provider/profile_license.validation'
import { withRouter } from 'react-router-dom'
import cogoToast from 'cogo-toast'
import  { CreateProfileLicense }  from '../../../../../api/senior_living'
import { getServiceDetailsApi } from '../../../../../api/updateServiceFunctionality/getServiceDetails';
import { updateProfileAndLicenseDetailsApi } from '../../../../../api/updateServiceFunctionality/updateServiceDetails';
import CrossBtn from '../../../../../assets/images/close.svg';

let setActiveTab = null, setCareId = null, setCareName = null;
let isUpdate = false;
let licenseIndexForApi = 0;
let formData = new FormData();
let firstLicence, secondLicence, thirdLicence;
let fieldDisabled = false;

let formInitialValues = {
    name: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    country: "",
    county: "",
    state: "",
    zipcode: "",
    fax_number: "",
    licences: [],
    licences_attributes: [],
    category: "home_share"
}

const ProfileAndLicenseDetails = (props) => {
    isUpdate = props.isUpdate;
    const [ FormValues, setFormValues ] = useState(formInitialValues)

    useEffect(() => {
        if(isUpdate){
            fetchProfileAndLicenseDetails();
        }
    }, [])

    const fetchProfileAndLicenseDetails = async() => {
        try{
            const response = await getServiceDetailsApi(props.match?.params?.careId, 'care_details');
            const { status, id, name, address1, address2, address3, city, county, state, country, zipcode, fax_number, licences } = response.data;
            const data = {
                ...formInitialValues,
                id, name, address1, address2, address3, city, county, state, country, zipcode, fax_number, licences,
            }
            setFormValues(data);
            fieldDisabled = ['active', 'in-progress'].includes(status);
        }
        catch(error){
            console.log(error);
        }
    }
    return (
        <ProfileAndLicenseDetailsPartial {...props} FormValues={FormValues} fieldDisabled={fieldDisabled} />
    )
}

const MyForm = (props) => {
    const [count, setCount] = useState(1)
    const {
        fieldDisabled,
        values,
        handleSubmit,
        setFieldValue,
        bindSubmitForm,
    } = props;

    setActiveTab = props.setactiveTab;
    setCareId = props.setCareId;
    setCareName = props.setCareName;
    
    bindSubmitForm(props.submitForm, 0);

    firstLicence = isUpdate && values?.licences.length > 0 &&
        values.licences.filter((_, index) => {
            return index === 0
        })
    
    secondLicence = isUpdate && values?.licences.length > 0 &&
        values.licences.filter((_, index) => {
            return index === 1
        })
    
    thirdLicence = isUpdate && values?.licences.length > 0 &&
        values.licences.filter((_, index) => {
            return index === 2
        })

    const handleRemoveLicense = (licenseId) => {
        let removeLicenseIndex;
        let updateLicenses = values.licences;

        updateLicenses.forEach((license, index) => {
            if(license.id === licenseId){
                removeLicenseIndex = index
            }
        })
        updateLicenses.splice(removeLicenseIndex, 1);
        setFieldValue('licences', updateLicenses);

        formData.append(`care[licences_attributes][${licenseIndexForApi}][_destroy]`, true);
        formData.append(`care[licences_attributes][${licenseIndexForApi}][id]`, licenseId);
        licenseIndexForApi++;
    }

    return (
        <div className="form-in-new-care">
            <Form>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Home Name" name="name" placeholder="Enter care name here" disabled={fieldDisabled} required/>
                    <FormInput type="hidden" name="category" required/>
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Address Line 1" name="address1" placeholder="Enter address line 1 here" disabled={fieldDisabled} required />
                    <FormInput type="text" labelText="Address Line 2" name="address2" disabled={fieldDisabled} placeholder="Enter address line 2 here"/>
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Address Line 3" name="address3" disabled={fieldDisabled} placeholder="Enter address line 3 here"/>
                    <FormInput type="text" labelText="City" name="city" placeholder="Enter city name here" disabled={fieldDisabled} required/>
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="County" name="county" disabled={fieldDisabled} placeholder="Enter county name here" required/>
                    <FormInput type="text" labelText="State" name="state" disabled={fieldDisabled} placeholder="Enter state name here" required/>
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Country" name="country" disabled={fieldDisabled} placeholder="Enter country name here" required/>
                    <FormInput type="text" labelText="Zip Code" name="zipcode" disabled={fieldDisabled} placeholder="Enter zip code here" required/>
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Fax Number" name="fax_number" placeholder="Enter fax number here" />
                    <div className="license-file-uploader form-group">
                    <label className="label-main">License Information</label>
                        <div className="file-indi">
                            <label>License1:</label>
                            <FileUpload label="Browse File" name="file1" value={[values?.licences_attributes?.[0]?.file?.name]} onChange={(files) => {
                                setFieldValue("licences_attributes.0.licence_type", "others");
                                setFieldValue("licences_attributes.0.file", files[0]);
                            }} /> 
                        </div>
                        {
                            firstLicence?.length > 0 &&
                            <div className="prev-file">
                                <a
                                    key={firstLicence[0]?.id}
                                    href={firstLicence[0]?.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{firstLicence[0]?.name}
                                </a>
                                <span><img src={CrossBtn} alt="Cross button" onClick={() => handleRemoveLicense(firstLicence[0]?.id)}/></span>
                            </div>
                        }
                        <div className="file-indi">
                            <label>License2:</label>
                            <FileUpload label="Browse File" name="file2" value={[values?.licences_attributes?.[1]?.file?.name]} onChange={(files) => {
                                setFieldValue("licences_attributes.1.licence_type", "others");
                                setFieldValue("licences_attributes.1.file", files[0]);
                            }} /> 
                        </div> 
                        {
                            secondLicence?.length > 0 &&
                            <div className="prev-file">
                                <a
                                    key={secondLicence[0]?.id}
                                    href={secondLicence[0]?.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{secondLicence[0]?.name}
                                </a>
                                <span><img src={CrossBtn} alt="Cross button" onClick={() => handleRemoveLicense(secondLicence[0]?.id)}/></span>
                            </div>
                        }
                        <div className="file-indi">
                            <label>License3:</label>
                            <FileUpload label="Browse File" name="file3" value={[values?.licences_attributes?.[2]?.file?.name]} onChange={(files) => {
                                setFieldValue("licences_attributes.2.licence_type", "others");
                                setFieldValue("licences_attributes.2.file", files[0]);
                            }} /> 
                        </div> 
                        {
                            thirdLicence?.length > 0 &&
                            <div className="prev-file">
                                <a
                                    key={thirdLicence[0]?.id}
                                    href={thirdLicence[0]?.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{thirdLicence[0]?.name}
                                </a>
                                <span><img src={CrossBtn} alt="Cross button" onClick={() => handleRemoveLicense(thirdLicence[0]?.id)}/></span>
                            </div>
                        }
                        { !Array.isArray(props.errors?.licences_attributes) &&  <ErrorMessage
                            name="licences_attributes"
                            component="span"
                            className="error-message"
                        /> }
                    </div>
                </div>
            </Form>
        </div>
    )
}

const ProfileAndLicenseDetailsPartial = withFormik({
    enableReinitialize: true,
    validationSchema: ProfileLicenseSchema,
    mapPropsToValues: props => (props.FormValues),
    handleSubmit: (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);
        Object.entries(values).forEach(([key, val]) => {
            if(key === "licences_attributes"){
                val.forEach((license_value, _) => {
                    if(license_value){
                        formData.append(`care[licences_attributes][${licenseIndexForApi}][licence_type]`, license_value['licence_type'])
                        formData.append(`care[licences_attributes][${licenseIndexForApi}][file]`, license_value['file'])
                        licenseIndexForApi++;
                    }
                })
            } else{
                if(val){
                    formData.append(`care[${key}]`, val)
                }
            }
        })
        if(!isUpdate){
            addNewCareProfileAndLicenseDeatils(setErrors);
        }
        else{
            updateProfileAndLicenseDetails(values.id);
        }
    },
})(MyForm)

const addNewCareProfileAndLicenseDeatils = async(setErrors) => {
    const { hide: hideLoading } = cogoToast.loading('Adding Profile...', { hideAfter: 0 });

    CreateProfileLicense(formData).then((res) => {
        hideLoading();
        cogoToast.success('Profile Created successfully.');
        setActiveTab("2")
        setCareId(res.data.id)
    })
    .catch((reason) => {
        hideLoading();
        if(reason.response.status === 422){
            setErrors(reason.response.data[0])
        } else{
            reason.handleGlobally && reason.handleGlobally()
        }
    })
}

const updateProfileAndLicenseDetails = async(serviceId) => {
    let response;
    const { hide: hideLoading } = cogoToast.loading('Updating Profile...', { hideAfter: 0 });
    try{
        response = await updateProfileAndLicenseDetailsApi(serviceId, formData);
        hideLoading();
        cogoToast.success('Profile updated successfully.');
       
        setActiveTab("2");
        setCareId(response.data.id);
        setCareName(response.data.name);
    }
    catch(error){
        hideLoading();
        console.log(error.response.data)
    }
}

export default withRouter(ProfileAndLicenseDetails)