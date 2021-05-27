import React, { useState } from 'react';
import FormInput from '../../shared/formInput';
import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { changePasswordSchema } from '../../../forms/validations/users.validation';
import { changePasswordApi } from '../../../api/users/forgotResetPassword'
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'   

const ChangePassword = (props) => {   

    const [userDetail] = useLocalStorage('userDetails', {})  
    const [isLogout, setLogout] = useState(false)  
    const userId = userDetail.id;   

    const logout = () => {
        localStorage.clear() 
        setLogout(true)
    }
    
    if(isLogout){
        props.history.push("/")
        props.history.go()
    }

    return (
        <div className="form-in-profile">
            <Formik
                initialValues = {{
                    current_password: "",
                    password: "",
                    password_confirmation: ""
                }}
                validationSchema={changePasswordSchema}
                onSubmit={async(values, { setSubmitting, setErrors }) => {
                    try{
                        const response = await changePasswordApi(values, userId);
                        cogoToast.success(response.data.msg, 10);
                        logout();
                    }
                    catch(error){
                        console.log(error)
                        cogoToast.error(error.response.data[0], 10)
                    }
                }}
            >
                <Form>
                    <div className="two-inputs-holder">
                        <FormInput type="password" name="current_password" id="current_password" placeholder="Enter Current Password" labelText="Current Password" required/>
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="password" name="password" id="password" placeholder="Enter New Password" labelText="New Password" required/>
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="password" name="password_confirmation" id="confirmPswrd" placeholder="Confirm New Password" labelText="Confirm New Password" required/>
                    </div>
                    <button className="btn-theme btn-transparent btn-form-in-profile">Save New password</button>
                </Form>
            </Formik>
        </div>
    )
}

export default withRouter(ChangePassword);