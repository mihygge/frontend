import React from 'react';
import './_payment-card.scss';
import { withRouter } from 'react-router-dom';
import {injectStripe} from 'react-stripe-elements';
import {CardElement } from 'react-stripe-elements';


const PaymentCard = (props) => {
    const handleSubmit = (ev) => {
        ev.preventDefault();
        props.paymentSubmit(props.stripe)  
    };

    return(
        <form onSubmit={handleSubmit} className="credit-card-holder">
            <div className="form-group">
                <label>Card Details</label>
                <CardElement/>
            </div>
            <button disabled={props.disable} className="btn-theme">{props.title}</button>
        </form>
    )
}

export default injectStripe(withRouter(PaymentCard));