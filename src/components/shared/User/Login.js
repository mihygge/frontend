import React, { useState } from 'react';

import { Formik, Form } from 'formik';
import FormInput from '../../../components/shared/formInput'
import LoginAPI from '../../../api/users/Login'

import { LoginSchema } from '../../../forms/validations/users.validation'
import CustomModal from '../../../modals'
import ForgotPassword from '../../../modals/forgotpassword';

import cogoToast from 'cogo-toast';

const Login = (props) => {
    const componentProps = {
        ...props,
        modal_title: 'Sign-in to miHygge'
    }

    const [forgotpasswordModalIsOpen, setForgotpasswordModalIsOpen] = useState(false);
    
    const toggleForgotpasswordModal = () => {
        props.toggle();
        setForgotpasswordModalIsOpen(!forgotpasswordModalIsOpen)
    }

    return (
        <>
        <CustomModal {...componentProps}>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    error_message: ''
                }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const res = await LoginAPI(values)
                        if(res.failed){
                            if(res.status === 500){
                                cogoToast.error('Internal Server Error, Contact Site Admin')
                            }else if(res.status === 422){
                                cogoToast.error(res.errors[0])
                            }
                        } else {
                            setSubmitting(false);

                            props.setToken(res.data.auth_token)
                            props.setUserDetails(res.data.user)
                            props.setUserName(`${res.data.user.first_name} ${res.data.user.last_name}`)
                            props.setLoginUsername(`${res.data.user.first_name} ${res.data.user.last_name}`)
                            
                            const userRole = res.data.user.role;
                            if(userRole==='customer'){
                                props.history.push("/customer")
                            }
                            else if(userRole==='provider'){
                                props.history.push("/provider")
                            }
                            else if(userRole==='social_worker'){
                                props.history.push("/customer")
                            }
                            else if(userRole==='admin'){
                                props.history.push("/adminHomePage")
                            }
                            props.history.go();
                        }
                    }catch(err){
                        console.log(err)
                        cogoToast('Unknown Server Error');
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormInput type="email" name="email" id="email" placeholder="Enter Your Email ID" labelText="Email Id" />
                        <FormInput type="password" name="password" id="password" placeholder="Enter Your Password" labelText="Password" />
                        <span
                            className="btn-theme btn-no-box btn-no-box-small btn-forgot-pswrd"
                            onClick={toggleForgotpasswordModal}
                        >Forgot your password</span>
                        <button className="btn-theme btn-in-modal btn-to-click">Sign In</button>
                    </Form>
                )}
            </Formik>
        </CustomModal>
        <ForgotPassword
            isOpen={forgotpasswordModalIsOpen}
            toggle={toggleForgotpasswordModal}
        />
        </>
    )
}
export default Login