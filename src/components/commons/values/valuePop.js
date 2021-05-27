import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';

const ValuePop = (props) => {
    return(
        <Modal className="modal-mini modal-values-pop" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                {props.title}
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <div className="description">{props.description}</div>
            </ModalBody>
        </Modal>
    )
}

export default ValuePop;