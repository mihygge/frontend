import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';

const UpgradePopup = (props) => {
    return(
        <Modal className="modal-mini" isOpen={props.isOpen} toggle={props.toggle}>
            <ModalHeader>
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <p className="description">Looks like you’ve increased the number of beds. You’re eligible for an upgraded subscription with another $140.88/year.</p>
                <div className="buttons-container">
                    <button className="btn-theme">Upgrade & Pay $239.98/year</button>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default UpgradePopup;