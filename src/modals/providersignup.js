import React, {useState, useEffect} from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
   } from 'reactstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import { withRouter } from "react-router";

import FormInput from '../components/shared/formInput';
import FormCheckOrRadio from '../components/shared/formCheckOrRadio';
import { RegisterSchema } from '../forms/validations/users.validation'

import getRoles from '../api/users/getRoles'
import Register from '../api/users/Register'
import { findProviderRole } from '../utils/users'

import { Input } from 'reactstrap'
import InputMask from 'react-input-mask'

const ProviderSignUp = (props)=> {
    const [provideId, setProviderId] = useState(null)
    useEffect(() =>{
        getRoles()
            .then((res) => {
                let provider = findProviderRole(res.data)
                setProviderId(provider.id)
            })

    }, [])

    return(
        <Modal className="modal-signup" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                Sign up as miHygge Provider
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
        <ModalBody>
            <Formik
                initialValues ={
                    {
                        first_name: "",
                        last_name: "",
                        email: "",
                        mobile: "",
                        messenger: "",
                        password: "",
                        password_confirmation: "",
                        above18: false,
                        role_id: provideId
                    }
                }
                validationSchema={RegisterSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                    const maskedMobileNumber = values.mobile;
                    if(values.mobile){
                        const unmaskedMobileNumber = values.mobile.match(/[0-9]/gi).join('');
                        values.mobile = unmaskedMobileNumber;
                    }
                    Register(values).then((res) => {
                        values.mobile = maskedMobileNumber;
                        if(res.failed){
                            setErrors(res.errors[0])
                        } else {
                            props.history.push("/thank-you")
                        }
                        setSubmitting(false);
                    })
                    .catch(() => {
                        setSubmitting(true);
                    })
                }}
            >
            {({
                values,
                handleChange,
                setFieldValue,
            }) => (
                <Form>
                    <FormInput type="text" name="first_name" id="firstname" placeholder="Enter Your First Name" labelText="First Name" required />
                    <FormInput type="text" name="last_name" id="lastname" placeholder="Enter Your last Name" labelText="Last Name" required/>
                    <FormInput type="email" name="email" id="email" placeholder="Enter Your Email ID" labelText="Email Id" required/>
                    <div className="two-inputs-holder">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <Input type="text" name='mobile' id="mobile" placeholder="Enter Mobile/Whatsapp No." tag={InputMask} mask="(+9) 999-999-9999"
                            onChange={(e)=>{
                                setFieldValue('mobile', e.target.value)
                            }} />
                             <ErrorMessage
                                name="mobile"
                                component="span"
                                className="error-message"
                            />
                        </div>
                        <FormInput type="text" name="messenger" id="fbmessanger" placeholder="Enter Facebook Messenger ID" labelText="Facebook Messenger ID" />
                    </div>
                    <div className="two-inputs-holder">
                        <FormInput type="password" name="password" id="password" placeholder="Enter Your Password" labelText="Password" required/>
                        <FormInput type="password" name="password_confirmation" id="confirmPswrd" placeholder="Confirm Your Password" labelText="Confirm Password" required/>
                    </div>
                    <FormCheckOrRadio type="checkbox" name="above18" id="check1" onChange={handleChange} className="check-to-proceed" checked={values.above18} labelText="Please confirm your age is above 18 years" required/>
                    <button className="btn-theme btn-in-modal btn-to-click">Sign Up</button>
                    <h5 className="click-to-action">Already have account?
                        <button 
                            className="btn-theme btn-no-box"
                            onClick={(e) => {
                                props.toggleSignin()
                                props.toggle()
                                e.stopPropagation()
                                e.preventDefault()
                            }}
                        >Sign In</button>
                    </h5>
                </Form>
              )}
            </Formik>
        </ModalBody>
        </Modal>
    )
}

export default withRouter(ProviderSignUp);