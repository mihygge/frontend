import React from 'react';
import {Formik, Form} from 'formik';
import FormInput from '../shared/formInput';

import cogoToast from 'cogo-toast';

import { resetPasswordSchema } from '../../forms/validations/users.validation';
import { resetPasswordApi } from '../../api/users/forgotResetPassword';

const ResetPassword = (props) => {
    const token = props.location.search.substr(1).split('=')[1];

    return (
        <div className="reset-password-container">
            <h2 className="title-main">Reset Password</h2>
            <Formik
                initialValues = {
                    {
                        password: "",
                        password_confirmation: ""
                    }
                }
                validationSchema={resetPasswordSchema}
                onSubmit={async(values, { setSubmitting, setErrors }) => {
                    try{
                        const response = await resetPasswordApi(values, token);
                        cogoToast.success(response.data.msg, 10);
                        setTimeout(props.history.push("/"), 10000);
                    }
                    catch(error){
                        console.log(error)
                        cogoToast.error(error.response.data[0]);
                    }
                }}
            >
                <Form>
                    <FormInput type="password" name="password" id="password" placeholder="Enter New Password" labelText="New Password" required/>
                    <FormInput type="password" name="password_confirmation" id="confirmPswrd" placeholder="Confirm New Password" labelText="Confirm New Password" required/>
                    <button className="btn-theme btn-in-modal btn-to-click btn-to-click-in-fp">Submit</button>
                </Form>
            </Formik>
        </div>
    )
}

export default ResetPassword
