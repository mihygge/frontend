import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap'
import PaymentCard from './paymentCard';
import {StripeProvider, Elements} from 'react-stripe-elements';

const CreditCardPop = (props) => {
    return(
        <Modal isOpen={props.isOpen} toggle={props.toggle} className="modal-mini modal-card-popup">
            <ModalHeader>
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <StripeProvider apiKey={process.env.REACT_APP_MIH_STRIPE_PK}>
                    <Elements>
                        <PaymentCard paymentSubmit={props.paymentSubmit} title="Add card"/>
                    </Elements>
                </StripeProvider>
            </ModalBody>
        </Modal>
    )
}

export default CreditCardPop;