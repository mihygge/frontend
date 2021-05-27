import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';

const CheckoutPopUp = (props) => {
    return(
        <Modal className="modal-mini modal-checkout-pop" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <p className="description">All the information provided for this Care is saved. Would you like to add more Care’s or continue to checkout and subscribe?</p>
                <div className="buttons-container">
                    <button className="btn-theme btn-transparent" onClick={props.add_more_care}>Add more Care</button>
                    <button className="btn-theme" onClick={props.buy_subscription}>Buy Subscription</button>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default CheckoutPopUp;