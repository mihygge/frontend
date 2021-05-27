import React, { useState } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Input,
    FormGroup
} from 'reactstrap';
import TermsAndConditionsContent from '../../assets/pages/termsAndConditions';
import termsAndConditions from '../../api/subscription/agreeTerms';
import cogoToast from 'cogo-toast';
import cx from 'classnames';

const TermsAndConditions = (props) => {
    const [notAgreed, setNotAgreed] = useState(true)
    const [docSignURL, setDocuSignURL] = useState('')
    const [title, setTitle] = useState("Terms and Conditions ('Terms')")

    const agreeTerms = () => {
        setNotAgreed(!notAgreed)
    }

    const signDigitally = () => {
        const { hide: hideLoading } = cogoToast.loading("Please wait...", { hideAfter: 0 });

        termsAndConditions()
            .then((res) => {
                hideLoading();
                setDocuSignURL(res.data.url)
                setTitle("Sign Digitally")
            })
            .catch(err => {
                hideLoading();
                console.log(err)
                cogoToast.error("Unable reach docusign. Please try later")
            })
    }

    return (
        <Modal className={cx("modal-terms-conditions", {"modal-terms-conditions-with-docsign-url" : docSignURL })} isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                {title}
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                {
                    docSignURL === '' ?
                    <TermsAndConditionsContent /> : ''
                }
                { docSignURL !== '' && <div className="terms-conditions-steps">
                    <div className="terms-conditions-steps-inner">
                        <p className="text-doc-url">
                            <strong>Step 1:</strong> Provider agreement is being sent to your registered email id.
                        </p>
                        <p className="text-doc-url">    
                            <strong>Step 2:</strong> We request you to kindly sign this Provider agreement via Docu-sign.
                        </p>
                        <p className="text-doc-url">
                            <strong>Step 3:</strong> After signing the Provider agreement you will now receive the Docu-Sign confirmation email from miHygge.
                        </p>
                        <p className="text-doc-url">
                            <strong>Step 4:</strong> We now ask you to kindly refresh this page, to proceed to the purchase of the subscription.
                        </p>
                        <p className="text-doc-url">
                            See how Docu-Sign works using the below link.
                            <br />
                            <a href="https://mih-staging.s3.amazonaws.com/docu-sign/dousign-demo.webm" target="_blank">
                                https://mih-staging.s3.amazonaws.com/docu-sign/dousign-demo.webm
                            </a>
                        </p>
                        <p className="text-doc-url">
                            Please feel free to contact us at <a href="mailto:contact@mihygge.com">contact@mihygge.com</a>.
                        </p>
                    </div>
                </div> }
              
                { docSignURL === '' ? <div className="section-buttons">
                    <FormGroup check className="form-group-radio-checkbox">
                        <div>
                            <Input className="form-control" type="checkbox" onClick={agreeTerms} />{' '}
                            <Label check>
                                Please accept Terms & conditions
                            </Label>
                        </div>
                    </FormGroup>
                    <button className="btn-theme btn-transparent" disabled={notAgreed} onClick={signDigitally}>Sign digitally</button>
                </div> : '' }
            </ModalBody>
        </Modal>
    )
}

export default TermsAndConditions;