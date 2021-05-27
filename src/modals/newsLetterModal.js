import React, { useState } from "react";
import {
    Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { Formik, Form} from "formik";
import { Row, Col } from "reactstrap";
import FormInput from "../components/shared/formInput";
import newsLetter from "../assets/images/news-letter.svg";
import * as Yup from 'yup';
import {newsLetterApi} from '../api/newsLetter/newsLetter';
import cogoToast from 'cogo-toast';

const NewsLetterPopUp = (props) => {
    const {toggle, isOpen } = props
    const [subscribed , setSubscribed] = useState(false);
    return (
        <Modal className="modal-mini modal-newsletter-pop" isOpen={isOpen} toggle={toggle}>
            <ModalHeader>
                <button type="button" className="close opacity-0" onClick={toggle} style={{zIndex:"999"}}></button>
            </ModalHeader>
            <ModalBody>
                <div className="newsletter-container">
                    <div><img src={newsLetter} /></div>
                    {!subscribed ? 
                        
                        <div className="welcome-container">
                            <h2 className="title-form">Welcome Home</h2>
                            <p>Sign-up for our Newsletter now and get exclusive discounts and many more benefits!</p>
                            <Formik
                                initialValues={{email: '' }}
                                validationSchema={Yup.object({
                                email: Yup.string().email('Please enter a valid email address.').required('Email address is required'),
                                })}
                                onSubmit={async(values, {setErrors }) => {
                                    const loadingMsg = "Signing up for newsletter...";
					                const successMsg = "You have successfully subscribed to our newsletter.";
					                const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 });
                                    try{ 
                                        const response = await newsLetterApi(values);
                                        hideLoading();
						                cogoToast.success(successMsg, 10);
                                        setSubscribed(true);
                                    }
                                    catch(error){
                                        console.log(error);
                                        setErrors(error.response.data[0])
                                        hideLoading();
                                        error.handleGlobally && error.handleGlobally();
                                    }
                                }}
                            >
                                {props => (
                                    <Form>
                                    <Row>
                                        <Col sm={12}>
                                            <FormInput
                                                type="text"
                                                name="email"
                                                id="email"
                                                labelText="Email"
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                    <Col sm={12}>
                                    <button className="btn-theme btn-submit" type="submit" disabled={!(props.isValid && props.dirty) }>Sign-up to Newsletter</button>
                                    </Col>    
                                
                                    </Row>
                                </Form>
                                )}
                            </Formik>
                        </div>

                        :

                        <div className="success-container">
                            <h2 className="title-form">Great!</h2>
                            <p>You have successfully subscribed to our newsletter, from now on you will recieve updates 
                                regarding changes to site, promotional offers directly into your inbox.</p>
                            <button className="btn-theme btn-submit" onClick={toggle}>Done</button>
                        </div>
    
                    }
                </div>
            </ModalBody>
        </Modal>
    )
}

export default NewsLetterPopUp;