import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';

const ConfirmationPop = (props) => {
    return(
        <Modal className="modal-mini modal-confirmation-pop" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <p className="description">{`Are you sure you want to continue with the ${props.confirmationDesc} ?`}</p>
                <div className="buttons-container">
                    <button className="btn-theme btn-transparent" onClick={props.toggle}>Back</button>
                    <button className="btn-theme" onClick={(e) => {props.executeOnConfirm(e); props.toggle();}}>Continue</button>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default ConfirmationPop;