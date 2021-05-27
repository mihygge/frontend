import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from "reactstrap";
import { Formik, Form } from "formik";
import FormInput from "../shared/formInput";
import FormSelect from "../shared/formSelect";
import "./_bank-details.scss";
import addBankDetail from "../../api/accounts/bankDetail";
import cogoToast from "cogo-toast";
import connect from "../../api/accounts/connect";
import useLocalStorage from '../../effects/LocalStorage/use-local-storage';
import { StripeAccountSchema } from '../../forms/validations/stripeaccount.validation';

const BankDetailsPop = props => {
    const [stripeConnectURL, setStripeConnectURL] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [userDetail] = useLocalStorage('userDetails', {})
    const [payout, setPayout] = useState(false)
    const [accId, setAccId] = useState("");

    const agreeTerms = () => {
        setBtnDisabled(!btnDisabled)
    }

    const connectStripe = () => {
        connect(userDetail.id)
            .then(res => {
                setStripeConnectURL(res.data.url)
                setPayout(res.data.payouts_enabled)
                setAccId(res.data.accId)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
      connectStripe()
    }, [])

    return (
        <Modal
            className="modal-bank-details"
            isOpen={props.isOpen}
            toggle={props.toggle}
        >
            <ModalHeader>
                Add Bank Details - miHygge Provider
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                {
                    payout ? <p className="note-stripe">Payment service setup has been completed. Please <a href={stripeConnectURL} target="_blank">click Here</a> if you want to update information.</p> :
                    accId !== '' ? <p className="note-stripe">Payment service initial setup has been done. Please <a href={stripeConnectURL} target="_blank">click Here</a> to add further information.</p> :
                    <Formik
                        initialValues={{
                            business_type: "",
                            bank_account: "",
                            routing_number: "",
                        }}
                        validationSchema={StripeAccountSchema}
                        onSubmit={(values) => {
                            const { hide: hideLoading } = cogoToast.loading('connecting with payment service. please wait....', { hideAfter: 0 });

                            addBankDetail(values)
                                .then(() => {
                                    hideLoading();
                                    connectStripe()
                                })
                                .catch(() => {
                                    hideLoading();
                                    setBtnDisabled(true);
                                    props.toggle();
                                    cogoToast.error("Unable to add bank details. Please try later")
                                })
                        }}
                    >
                    {({ setFieldValue }) => (
                        <Form>
                            <FormSelect
                                options={[
                                    { label: "Individual", value: "individual" },
                                    { label: "Company", value: "company" }
                                ]}
                                labelText="Account Type"
                                placeholder="Select Account Type"
                                name="business_type"
                                onChange={(data)=>{
                                    setFieldValue('business_type', data.value)
                                }}
                                required
                                classNameOut="selector-account"
                            />
                            <div className="individual-account">
                                <div className="two-inputs-holder">
                                    <FormInput
                                        type="text"
                                        name="bank_account"
                                        placeholder="Enter your bank account details"
                                        labelText="Bank Account"
                                        required
                                    />
                                    <FormInput
                                        type="text"
                                        name="routing_number"
                                        placeholder="Enter your routing number"
                                        labelText="Routing Number"
                                        required
                                    />
                                </div>
                                {/* <FormGroup check inline className="form-group-radio-checkbox">
                                    <Label check>
                                        <Input type="checkbox" onClick={agreeTerms}/> 
                                        <p> By registering your account, you agree to our <a href="https://stripe.com/legal">Services Agreement</a> and the <a target="_blank" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.</p> 
                                    </Label>
                                </FormGroup> */}
                                <FormGroup check inline className="form-group-radio-checkbox form-check-bank-deatils">
                                    <div>
                                        <Input type="checkbox" className="form-control" onClick={agreeTerms}/> 
                                        <Label check>
                                            <p> By registering your account, you agree to our <a href="https://stripe.com/legal">Services Agreement</a> and the <a target="_blank" href="https://stripe.com/connect-account/legal">Payment service connected Account Agreement</a>.</p> 
                                        </Label>
                                    </div>
                                </FormGroup>
                                <button className="btn-theme btn-in-modal" disabled={btnDisabled}>Connect with payment service</button>
                            </div> 
                        </Form>
                    )}    
                    </Formik>
                }           
            </ModalBody>
        </Modal>
    );
};

export default BankDetailsPop;
