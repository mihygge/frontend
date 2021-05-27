import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {injectStripe} from 'react-stripe-elements';
import {CardElement } from 'react-stripe-elements';
import cogoToast from 'cogo-toast';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import confirmBookingApi from '../../../api/customer/confirmBookingApi';
import { Input } from "reactstrap";
import Terms_Of_Serivce from '../../../assets/documents/terms_of_service.pdf';
import UpgradePop from '../../../modals/upgradepop';

const BookingPaymentCard = (props) => {
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [userDetail] = useLocalStorage('userDetails', {})
    const [showModal, setShowModal] = useState(false)

    const agreeTerms = () => {
        setBtnDisabled(!btnDisabled)
    }

    const handleSubmit = (ev) => {
        let userName = userDetail.first_name + '' + userDetail.last_name
        ev.preventDefault();
        const { hide: hideLoading } = cogoToast.loading("Payment is processing. Please wait...", { hideAfter: 0 });

        props.stripe.createToken({type: 'card', name: userName}).then((result) => {
            confirmBookingApi(props.bookingId, result.token.id, 'token').then((res)=> {
                hideLoading();
                cogoToast.success("Payment for booking has been done successfully...")
                setShowModal(true)

            }).catch((err) => {
                console.log(err)
                hideLoading();
                cogoToast.error("Unable to process payment. Please try later")
            })
        }).catch((result) => {
            console.log(result.error)
            hideLoading();
            cogoToast.error("Payment failed. Incorrect card details")
        })
    };

    return(
        <div className="credit-card-section-wrapper credit-card-section-wrapper-customer">
            <div className="section-card-holder">
                <form onSubmit={handleSubmit} className="credit-card-holder">
                    <div className="form-group">
                        <label>Card Details</label>
                        <CardElement/>
                    </div>
                    <div className="form-group-radio-checkbox">
                        <div>
                            <Input type="checkbox" className="form-control" onClick={agreeTerms}/> 
                            <label>I agree the <a href={Terms_Of_Serivce} target="_blank">Terms & Conditions</a></label>
                        </div>
                    </div>
                    <button disabled={btnDisabled} className="btn-theme" >Confirm & Pay</button>
                </form>
            </div>
            <UpgradePop isOpen={showModal} bookingId={props.bookingId}/>
        </div>
        
    )
}

export default injectStripe(withRouter(BookingPaymentCard));