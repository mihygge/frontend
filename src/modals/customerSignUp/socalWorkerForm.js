import React, {useState, useEffect} from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import FormInput from '../../components/shared/formInput';
import FormCheckOrRadio from '../../components/shared/formCheckOrRadio';
import getRoles from '../../api/users/getRoles'
import { findWorkerRole } from '../../utils/users'
import { RegisterSchema } from '../../forms/validations/users.validation'
import Register from "../../api/users/Register";
import { Input } from 'reactstrap'
import InputMask from 'react-input-mask'
import { withRouter } from "react-router";

const SocailWorkerForm = (props) => {
    const [workerId, setWorkerId] = useState(null)
    useEffect(() =>{
        getRoles()
            .then((res) => {
                let worker = findWorkerRole(res.data)
                setWorkerId(worker.id)
            })
    }, [])

    return(
        <Formik
            initialValues ={
                {
                    first_name: "",
                    last_name: "",
                    email: "",
                    mobile: "",
                    address: "",
                    organization: "",
                    profession: "",
                    password: "",
                    above18: false,
                    password_confirmation: "",
                    role_id: workerId
                }
            }
            validationSchema={RegisterSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                const maskedMobileNumber = values.mobile;
                values.role_id = workerId;
                if(values.mobile) {
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
        >{({values, setFieldValue, handleChange}) => (
            <Form>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="First Name" name="first_name" placeholder="Enter Your First name" required />
                    <FormInput type="text" labelText="Last Name" name="last_name" placeholder="Enter Your Last Name" required />
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Email Id" name="email" placeholder="Enter Your Email ID" required />
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <Input type="text" name='mobile' id="mobile" placeholder="Enter Your Mobile Number" tag={InputMask} mask="(+9) 999-999-9999"
                        onChange={(e)=>{
                            setFieldValue('mobile', e.target.value)
                        }}/>
                            <ErrorMessage
                            name="mobile"
                            component="span"
                            className="error-message"
                        />
                    </div>
                </div>
                <FormInput type="text" labelText="Address" name="address" placeholder="Enter Your Address"/>
                <div className="two-inputs-holder">
                    <FormInput type="text" labelText="Organization Name" name="organization" placeholder="Enter Your Organization Name" />
                    <FormInput type="text" labelText="Profession" name="profession" placeholder="Enter Your Profession" />
                </div>
                <div className="two-inputs-holder">
                    <FormInput type="password" labelText="Enter Password" name="password" placeholder="Enter Your Password" required />
                    <FormInput type="password" labelText="Confirm Password" name="password_confirmation" placeholder="Confirm Your Password" required />
                </div>
                <FormCheckOrRadio type="checkbox" name="above18" id="check1" onChange={handleChange} checked={values.above18} className="check-to-proceed" labelText="Please confirm your age is above 18 years" required />
                <button className="btn-theme btn-in-modal btn-to-click">Sign Up</button>
            </Form>
        )}
        </Formik>
    )
}

export default withRouter(SocailWorkerForm);