import React, { useState, useEffect } from 'react';
import FormInput from '../../shared/formInput';
import { Formik, Form, ErrorMessage } from 'formik';
import { withRouter } from 'react-router-dom';
import { updateProfileSchema } from '../../../forms/validations/users.validation'
import { getUserProfileApi, updateProfileApi } from '../../../api/users/updateProfile'
import cogoToast from 'cogo-toast';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'
import { connect } from 'react-redux';
import { setusername } from '../../../manageState/ProviderHeader';

import { Input } from 'reactstrap'
import InputMask from 'react-input-mask'

const BasicDetails = (props) => {

    const initialValues = {
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        messenger: '',
    }
    
    const [FormValues, setFormValues] = useState(initialValues);
    const [maskedMobileNumber, setMaskedMobileNumber] = useState('');

    const [userDetail] = useLocalStorage('userDetails', {})
    const userId = userDetail.id;

    const [_username, setUserName] = useLocalStorage('username', '');
    const [_userDetails, setUserDetails] = useLocalStorage('userDetails', {})
    
    useEffect(() => {
        getUserDetails();
    }, [userDetail])

    const getUserDetails = async () => {
        const response = await getUserProfileApi(userId);
        const { first_name, last_name, email, mobile, messenger } = response.data

        let m = mobile;
        let maskedMobile;
        if(mobile){
            let unmaskedMobile = m.match(/[0-9]/gi).join('');
            m = unmaskedMobile;
            maskedMobile = `(+${m[0]}) ${m[1]}${m[2]}${m[3]}-${m[4]}${m[5]}${m[6]}-${m[7]}${m[8]}${m[9]}${m[10]}`;
            setMaskedMobileNumber(maskedMobile);
        }

        const updatedValues = {
            ...FormValues,
            first_name: first_name,
            last_name: last_name,
            email: email,
            mobile: maskedMobile,
            messenger: messenger,
        }
    
        setFormValues(updatedValues)
    }

    return (
        <div className="form-in-profile">
            <Formik 
                enableReinitialize={true}
                initialValues={FormValues}
                validationSchema={updateProfileSchema}
                onSubmit={async(values, { setSubmitting, resetForm, setFieldValue }) => {
                    const maskedMobileNumber = values.mobile;
                    if(values.mobile){
                        // change masked mobile number to unmasked so that unmasked number(only number) will go in api's form data.
                        const unmaskedMobileNumber = values.mobile.match(/[0-9]/gi).join('');
                        values.mobile = unmaskedMobileNumber;
                    }
                    
                    const loadingMsg = 'Updating Profile details...';
                    const successMsg = 'You have successfully updated your details.'
                    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
                    try{
                        const response = await updateProfileApi(values, userId);
                        hideLoading()
                        cogoToast.success(successMsg, 10);
                        
                        // change mobile back to masked so that validation won't fail with masking if you click on update button again
                        values.mobile = maskedMobileNumber;

                        const updatedName = `${response.data?.first_name} ${response.data?.last_name}`
                        const updatedUserDetails = {
                            ...userDetail,
                            first_name: response.data?.first_name,
                            last_name: response.data?.last_name,
                        }
                        setUserName(updatedName);
                        setUserDetails(updatedUserDetails);
                        props.setLoginUsername(updatedName);
                    }
                    catch(error){
                        hideLoading();
                        console.log(error)
                        cogoToast.error('Something went wrong.', 10);
                    }
                }}
            >
            {({ setFieldValue }) => (
                <Form>
                    <FormInput type="text" name="first_name" id="first_name" labelText="First Name" placeholder="" /> 
                    <FormInput type="text" name="last_name" id="last_name" labelText="Last Name" placeholder="" /> 
                    <FormInput type="email" name="email" id="email" labelText="Email ID" placeholder="" disabled={true} /> 
                    <div className="two-inputs-holder">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <Input
                                type="text"
                                name='mobile'
                                id="mobile"
                                placeholder="Enter Mobile/Whatsapp No."
                                tag={InputMask}
                                mask="(+9) 999-999-9999"
                                value={maskedMobileNumber}
                                onChange={(e)=>{
                                    setFieldValue('mobile', e.target.value)
                                    setMaskedMobileNumber(e.target.value);
                                }}
                            />
                            <ErrorMessage
                                name="mobile"
                                component="span"
                                className="error-message"
                            />
                        </div>
                        <FormInput type="text" name="messenger" id="messenger" labelText="Facebook Messenger ID" placeholder="" /> 
                    </div>
                    <button className="btn-theme btn-transparent btn-form-in-profile" type='submit'>Update & Save</button>   
                </Form>
            )}
            </Formik>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        setLoginUsername: username => dispatch(setusername({username:username}))
    };
}

export default connect(null, mapDispatchToProps)(withRouter(BasicDetails));