import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import IconWarning from '../../assets/images/icon-warning.svg';

const CancelSubscriptionPop = (props) => {
    return(
        <Modal className="modal-mini modal-cancel-sub" isOpen={props.isOpen} toggle={props.toggle}>
            <img src={IconWarning} alt="Warning Icon" className="icon-warning" />
            <ModalHeader>
                Cancel {props.title}?
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <p className="description">Upon cancelling you will receive the amount paid (tax and prorated amount deducted) within next 7 business days into your bank account</p>
                <div className="buttons-container">
                    <button className="btn-theme btn-no-box" onClick={props.toggle}>Cancel</button>
                    <button className="btn-theme btn-transparent" onClick={props.api}>Confirm cancellation</button>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default CancelSubscriptionPop;