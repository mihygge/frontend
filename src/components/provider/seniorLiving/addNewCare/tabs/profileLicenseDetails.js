import React, { useState, useEffect } from 'react';
import { withFormik, ErrorMessage } from 'formik';
import cogoToast from 'cogo-toast'
import { withRouter } from 'react-router-dom';
import FormInput from '../../../../shared/formInput';
import FileUpload from '../../../../shared/fileUpload';
import ProfileLicenseSchema  from '../../../../../forms/validations/senior_living_provider/profile_license.validation'
import  { CreateProfileLicense }  from '../../../../../api/senior_living'
import { getServiceDetailsApi } from '../../../../../api/updateServiceFunctionality/getServiceDetails';
import { updateProfileAndLicenseDetailsApi } from '../../../../../api/updateServiceFunctionality/updateServiceDetails';
import CrossBtn from '../../../../../assets/images/close.svg';

let setActiveTab = null, setCareId = null, setCareName = null;
let isUpdate = false;
let licenseIndexForApi = 0;
let formData = new FormData();
let careStatus = '';
let fieldDisabledInState = ['active', 'in-progress'];

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
    category: 'senior_living'
}

const ProfileAndLicenseDetails = props => {

    isUpdate = props.isUpdate;
    const [ FormValues, setFormValues ] = useState(formInitialValues)

    useEffect(() => {
        if(isUpdate){
            fetchProfileAndLicenseDetails();
        }
    }, [])

    useEffect(() => {
        if(props.activeMainTab === '1' ){
            props.setSaveNextButton(true)
        }
    }, [props.activeMainTab])

    const fetchProfileAndLicenseDetails = async() => {
        try{
            const response = await getServiceDetailsApi(props.match?.params?.careId, 'care_details');
            const { status, id, name, address1, address2, address3, city, county, state, country, zipcode, fax_number, licences, category } = response.data;
            const data = {
                ...formInitialValues,
                id, name, address1, address2, address3, city, county, state, country, zipcode, fax_number, licences, category,
            }
            setFormValues(data);
            careStatus = status;
        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <ProfileAndLicenseDetails1 {...props} fieldDisabledInState={fieldDisabledInState} careStatus={careStatus} FormValues={FormValues} />
    )
}

const MyForm = props => {
    const {
        fieldDisabledInState,
        careStatus,
        values,
        handleSubmit,
        setFieldValue,
        bindSubmitForm,
    } = props;

    setActiveTab = props.setactiveTab;
    setCareId = props.setCareId;
    setCareName = props.setCareName;
    
    bindSubmitForm(props.submitForm, 0);

    const reguarLicense = isUpdate && values?.licences.length > 0 &&
                            values.licences.filter((license, index) => {
                                return license.licence_type === 'regular'
                            })

    const hospiceLicense = isUpdate && values?.licences.length > 0 &&
                            values.licences.filter((license, index) => {
                                return license.licence_type === 'hospice'
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
                <form noValidate onSubmit={handleSubmit}>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Care Name" name="name" placeholder="Enter care name here" disabled={fieldDisabledInState.includes(careStatus)} required />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Address Line 1" name="address1" placeholder="Enter address line 1 here" disabled={fieldDisabledInState.includes(careStatus)} required />
                        <FormInput type="text" labelText="Address Line 2" name="address2" placeholder="Enter address line 2 here" disabled={fieldDisabledInState.includes(careStatus)} />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Address Line 3" name="address3" placeholder="Enter address line 3 here" disabled={fieldDisabledInState.includes(careStatus)} />
                        <FormInput type="text" labelText="City" name="city" placeholder="Enter city name here" disabled={fieldDisabledInState.includes(careStatus)} required/>
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="County" name="county" placeholder="Enter county name here" disabled={fieldDisabledInState.includes(careStatus)} required/>
                        <FormInput type="text" labelText="State" name="state" placeholder="Enter state name here" disabled={fieldDisabledInState.includes(careStatus)} required/>
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Country" name="country" placeholder="Enter country name here" disabled={fieldDisabledInState.includes(careStatus)} required/>
                        <FormInput type="text" labelText="Zip Code" name="zipcode" placeholder="Enter zip code here" disabled={fieldDisabledInState.includes(careStatus)} required/>
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="text" labelText="Fax Number" name="fax_number" placeholder="Enter fax number here" />
                        <div className="license-file-uploader form-group">
                                <label className="label-main">License Information</label>
                                <div className="file-indi">
                                    <label>Regular:</label>
                                    <FileUpload label="Browse File" name="file1" value={[values?.licences_attributes?.[0]?.file?.name]} onChange={(files) => {
                                        setFieldValue("licences_attributes.0.licence_type", "regular");
                                        setFieldValue("licences_attributes.0.file",files[0]);
                                    }} /> 
                                </div>
                                {
                                    reguarLicense?.length>0 &&
                                    <div className="prev-file">
                                        <a
                                            key={reguarLicense[0]?.id}
                                            href={reguarLicense[0]?.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >{reguarLicense[0]?.name}
                                        </a>
                                        <span><img src={CrossBtn} alt="Cross button" onClick={() => handleRemoveLicense(reguarLicense[0]?.id)}/></span>
                                    </div>
                                }
                                <div className="file-indi">
                                    <label>Hospice:</label>
                                    <FileUpload label="Browse File" name="file2" value={[values?.licences_attributes?.[1]?.file?.name]} onChange={(files) => {
                                        setFieldValue("licences_attributes.1.licence_type", "hospice");
                                        setFieldValue("licences_attributes.1.file", files[0]);
                                    }} /> 
                                </div> 
                                {
                                    hospiceLicense?.length>0 &&
                                    <div className="prev-file">
                                        <a
                                            key={hospiceLicense[0]?.index}
                                            href={hospiceLicense[0]?.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >{hospiceLicense[0]?.name}
                                        </a>
                                        <span><img src={CrossBtn} alt="Cross button" onClick={() => handleRemoveLicense(hospiceLicense[0]?.id)}/></span>
                                    </div>
                                }
                                { !Array.isArray(props.errors?.licences_attributes) &&  <ErrorMessage
                                    name="licences_attributes"
                                    component="span"
                                    className="error-message"
                                /> }
                        </div>
                    </div>
                </form>
        </div>
    )
}

const ProfileAndLicenseDetails1 = withFormik({
    enableReinitialize: true,
    validationSchema: ProfileLicenseSchema,
    mapPropsToValues: props => (props.FormValues),
    handleSubmit: (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);
        Object.entries(values).forEach(([key, val]) => {
            if(isUpdate && key === 'licences' && values.licences_attributes.length>0){
                val.forEach((oldLicense, index ) => {
                    values.licences_attributes.forEach((newLicense, index) => {
                        if(oldLicense?.licence_type === newLicense?.licence_type){
                            formData.append(`care[licences_attributes][${licenseIndexForApi}][_destroy]`, true)
                            formData.append(`care[licences_attributes][${licenseIndexForApi}][id]`, oldLicense.id)
                            licenseIndexForApi++;
                        }
                    }) 
                })
            }
            if(key === "licences_attributes"){
                val.forEach((license_value, index ) => {
                    if(license_value){
                        formData.append(`care[licences_attributes][${licenseIndexForApi}][licence_type]`, license_value['licence_type'])
                        formData.append(`care[licences_attributes][${licenseIndexForApi}][file]`, license_value['file'])
                        licenseIndexForApi++;
                    }
                })
            } else{
                formData.append(`care[${key}]`, val)
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
    const loadingMsg = 'Adding a new Profile...';
    const successMsg = 'Profile Created successfully.';
    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });
    CreateProfileLicense(formData).then((res) => {
        hideLoading();
        cogoToast.success(successMsg);
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
    const loadingMsg = 'Updating Profile & License Details...';
    const successMsg = 'Profile & License Details updated successfully.';
    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });
    try{
        response = await updateProfileAndLicenseDetailsApi(serviceId, formData);
        hideLoading();
        cogoToast.success(successMsg);
        setActiveTab("2");
        setCareId(response.data.id);
        setCareName(response.data.name);
    }
    catch(error){
        hideLoading();
        console.log(error)
    }
}

export default withRouter(ProfileAndLicenseDetails);