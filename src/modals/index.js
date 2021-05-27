import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
} from 'reactstrap';
const CustomModal = (props) => (
    <React.Fragment>
        <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
            <ModalHeader>
                {props.modal_title}
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
        </Modal>
    </React.Fragment>
)

export default CustomModal