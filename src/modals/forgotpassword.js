import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { Formik, Form } from 'formik';
import FormInput from '../components/shared/formInput';
import { ForgotPasswordSchema } from '../forms/validations/users.validation';
import { forgotPasswordApi } from '../api/users/forgotResetPassword';

import cogoToast from 'cogo-toast';

const ForgotPassword = (props) => {
    return(
        <Modal isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                Forgot Password
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={async(values, { setSubmitting, setErrors }) => {
                        try{
                            const response = await forgotPasswordApi(values);
                            cogoToast.success(response.data.msg, 10)
                        }
                        catch(error){
                            console.log(error)
                            cogoToast.error(error.response.data[0], 10)
                        }
                    }}
                >
                    <Form>
                        <FormInput type="email" name="email" id="email" placeholder="Enter Your Email ID" labelText="Email Id" />
                        <button className="btn-theme btn-in-modal btn-to-click btn-to-click-in-fp">Submit</button>
                    </Form>
                </Formik>
            </ModalBody>
        </Modal>
    )
}

export default ForgotPassword;